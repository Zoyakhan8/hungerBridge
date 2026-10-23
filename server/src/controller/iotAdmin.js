
import { and, desc, eq, isNull } from "drizzle-orm";
import {
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

import { db } from "../config/dbClient.js";
import {
  iotBoxes,
  iotReadings,
  iotAlerts,
  iotBoxAssignments,
} from "../model/iotSchema.js";
import { donations } from "../model/donationSchema.js";
import { donors } from "../model/donorRegisterSchema.js";
import { donationRequests } from "../model/donationRequestSchema.js";
import { deliveries } from "../model/deliverySchema.js";
import { deliveryPartners } from "../model/deliveryPartnerSchema.js";
import { ngos } from "../model/ngoRegisterSchema.js";

const HEARTBEAT_TIMEOUT_MS = 2 * 60 * 1000;

const hashSecret = (secret) =>
  createHash("sha256").update(secret).digest("hex");

const getBoxStatus = (lastSeenAt, now = Date.now()) => {
  if (!lastSeenAt) return "offline";

  const elapsed = now - new Date(lastSeenAt).getTime();

  return elapsed >= 0 && elapsed <= HEARTBEAT_TIMEOUT_MS
    ? "online"
    : "offline";
};

const sendKnownError = (res, error) => {
  const errors = {
    DONATION_NOT_FOUND: [404, "Donation not found."],
    DONATION_NOT_READY: [
      409,
      "Only accepted donations can receive an IoT box.",
    ],
    DONATION_ALREADY_ASSIGNED: [
      409,
      "This donation already has an active IoT box.",
    ],
    BOX_UNAVAILABLE: [
      409,
      "No available IoT box was found.",
    ],
  };

  const known = errors[error.message];

  if (!known) return false;

  return res.status(known[0]).json({
    success: false,
    message: known[1],
  });
};

// POST /api/admin/monitoring/boxes/register
// Register a physical box from the admin panel.
export const registerIoTBox = async (req, res) => {
  try {
    const boxCode =
      typeof req.body?.boxCode === "string"
        ? req.body.boxCode.trim().toUpperCase()
        : "";

    if (!/^[A-Z0-9_-]{3,50}$/.test(boxCode)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid box name, such as BOX-001.",
      });
    }

    // The raw secret is returned only once.
    const deviceSecret = randomBytes(32).toString("hex");

    const [box] = await db
      .insert(iotBoxes)
      .values({
        boxCode,
        deviceSecretHash: hashSecret(deviceSecret),
        isActive: true,
        updatedAt: new Date(),
      })
      .returning({
        id: iotBoxes.id,
        boxCode: iotBoxes.boxCode,
        isActive: iotBoxes.isActive,
        createdAt: iotBoxes.createdAt,
      });

    return res.status(201).json({
      success: true,
      message:
        "Box registered. Save the device secret securely; it cannot be retrieved later.",
      data: {
        ...box,
        deviceSecret,
        availability: "available",
        connectionStatus: "offline",
      },
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "This box name is already registered.",
      });
    }

    console.error("registerIoTBox:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to register IoT box.",
    });
  }
};

// GET /api/admin/monitoring/overview
export const getIoTOverview = async (req, res) => {
  try {
    const boxes = await db.select().from(iotBoxes);

    const activeAlerts = await db
      .select({ id: iotAlerts.id })
      .from(iotAlerts)
      .where(eq(iotAlerts.status, "active"));

    const now = Date.now();

    const onlineBoxes = boxes.filter(
      (box) =>
        box.isActive &&
        getBoxStatus(box.lastSeenAt, now) === "online"
    ).length;

    const availableBoxes = boxes.filter(
      (box) => box.isActive && box.donationId == null
    ).length;

    return res.status(200).json({
      success: true,
      data: {
        totalBoxes: boxes.length,
        onlineBoxes,
        offlineBoxes: boxes.filter(
          (box) =>
            !box.isActive ||
            getBoxStatus(box.lastSeenAt, now) === "offline"
        ).length,
        availableBoxes,
        assignedBoxes: boxes.filter(
          (box) => box.isActive && box.donationId != null
        ).length,
        inactiveBoxes: boxes.filter((box) => !box.isActive).length,
        activeAlerts: activeAlerts.length,
      },
    });
  } catch (error) {
    console.error("getIoTOverview:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load IoT overview.",
    });
  }
};

// GET /api/admin/monitoring/boxes
export const getIoTBoxes = async (req, res) => {
  try {
    const boxes = await db
      .select({
        id: iotBoxes.id,
        boxCode: iotBoxes.boxCode,
        isActive: iotBoxes.isActive,
        lastSeenAt: iotBoxes.lastSeenAt,
        createdAt: iotBoxes.createdAt,
        donationId: iotBoxes.donationId,
        foodName: donations.foodName,
        donationStatus: donations.donationStatus,
        donorName: donors.name,
        donorCompany: donors.companyName,
        donorShop: donors.shopName,
      })
      .from(iotBoxes)
      .leftJoin(
        donations,
        eq(iotBoxes.donationId, donations.donation_id)
      )
      .leftJoin(donors, eq(donations.donor_id, donors.id))
      .orderBy(desc(iotBoxes.createdAt));

    const data = await Promise.all(
      boxes.map(async (box) => {
        // Never show a previous donation's readings as current readings.
        const readingQuery = db
          .select()
          .from(iotReadings)
          .where(
            box.donationId == null
              ? eq(iotReadings.boxId, box.id)
              : and(
                  eq(iotReadings.boxId, box.id),
                  eq(iotReadings.donationId, box.donationId)
                )
          )
          .orderBy(desc(iotReadings.recordedAt))
          .limit(1);

        const [reading] = await readingQuery;

        let ngoName = null;
        let deliveryPartnerName = null;
        let deliveryStatus = null;

        if (box.donationId != null) {
          const [assignment] = await db
            .select({
              ngoName: ngos.organizationName,
              deliveryPartnerName: deliveryPartners.fullName,
              deliveryStatus: deliveries.status,
            })
            .from(donationRequests)
            .leftJoin(
              ngos,
              eq(donationRequests.ngoId, ngos.id)
            )
            .leftJoin(
              deliveries,
              eq(deliveries.requestId, donationRequests.id)
            )
            .leftJoin(
              deliveryPartners,
              eq(
                deliveries.deliveryPartnerId,
                deliveryPartners.id
              )
            )
            .where(
              eq(donationRequests.donationId, box.donationId)
            )
            .orderBy(desc(donationRequests.createdAt))
            .limit(1);

          ngoName = assignment?.ngoName ?? null;
          deliveryPartnerName =
            assignment?.deliveryPartnerName ?? null;
          deliveryStatus = assignment?.deliveryStatus ?? null;
        }

        const status = !box.isActive
          ? "inactive"
          : getBoxStatus(box.lastSeenAt);

        return {
          ...box,
          status,
          availability:
            !box.isActive
              ? "inactive"
              : box.donationId == null
                ? "available"
                : "assigned",
          latestReading: reading ?? null,
          ngoName,
          deliveryPartnerName,
          deliveryStatus,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("getIoTBoxes:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load IoT boxes.",
    });
  }
};

// GET /api/admin/monitoring/alerts
export const getIoTAlerts = async (req, res) => {
  try {
    const alerts = await db
      .select({
        id: iotAlerts.id,
        boxId: iotAlerts.boxId,
        alertType: iotAlerts.alertType,
        severity: iotAlerts.severity,
        message: iotAlerts.message,
        status: iotAlerts.status,
        createdAt: iotAlerts.createdAt,
        acknowledgedAt: iotAlerts.acknowledgedAt,
        resolvedAt: iotAlerts.resolvedAt,
        boxCode: iotBoxes.boxCode,
      })
      .from(iotAlerts)
      .innerJoin(
        iotBoxes,
        eq(iotAlerts.boxId, iotBoxes.id)
      )
      .orderBy(desc(iotAlerts.createdAt));

    return res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error("getIoTAlerts:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load IoT alerts.",
    });
  }
};

// POST /api/admin/readings
// Called by the ESP32; authentication uses its per-box secret.
export const receiveIoTReading = async (req, res) => {
  try {
    const boxCode =
      typeof req.body?.boxCode === "string"
        ? req.body.boxCode.trim().toUpperCase()
        : "";

    const secret = req.get("x-device-secret");

    if (!boxCode || typeof secret !== "string" || !secret) {
      return res.status(400).json({
        success: false,
        message: "boxCode and device secret are required.",
      });
    }

    const [box] = await db
      .select()
      .from(iotBoxes)
      .where(eq(iotBoxes.boxCode, boxCode))
      .limit(1);

    if (!box || !box.isActive) {
      return res.status(401).json({
        success: false,
        message: "Unknown or inactive IoT box.",
      });
    }

    const receivedHash = Buffer.from(hashSecret(secret), "hex");
    const storedHash = Buffer.from(box.deviceSecretHash, "hex");

    if (
      receivedHash.length !== storedHash.length ||
      !timingSafeEqual(receivedHash, storedHash)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid device secret.",
      });
    }

    const {
      temperature,
      foodTemperature,
      humidity,
      doorOpen,
      doorOpenCount,
      batteryPercent,
    } = req.body;

    for (const [name, value] of Object.entries({
      temperature,
      foodTemperature,
      humidity,
      doorOpenCount,
      batteryPercent,
    })) {
      if (
        value !== undefined &&
        value !== null &&
        (typeof value !== "number" || !Number.isFinite(value))
      ) {
        return res.status(400).json({
          success: false,
          message: `${name} must be a valid number.`,
        });
      }
    }

    if (
      temperature != null &&
      (temperature < -50 || temperature > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "temperature is outside the allowed range.",
      });
    }

    if (
      foodTemperature != null &&
      (foodTemperature < -50 || foodTemperature > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "foodTemperature is outside the allowed range.",
      });
    }

    if (humidity != null && (humidity < 0 || humidity > 100)) {
      return res.status(400).json({
        success: false,
        message: "humidity must be between 0 and 100.",
      });
    }

    if (
      doorOpen != null &&
      typeof doorOpen !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "doorOpen must be a boolean.",
      });
    }

    if (
      doorOpenCount != null &&
      (!Number.isInteger(doorOpenCount) || doorOpenCount < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "doorOpenCount must be a non-negative integer.",
      });
    }

    if (
      batteryPercent != null &&
      (!Number.isInteger(batteryPercent) ||
        batteryPercent < 0 ||
        batteryPercent > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "batteryPercent must be between 0 and 100.",
      });
    }

    const recordedAt = req.body.recordedAt
      ? new Date(req.body.recordedAt)
      : new Date();

    if (
      Number.isNaN(recordedAt.getTime()) ||
      recordedAt.getTime() > Date.now() + 5 * 60 * 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid recordedAt timestamp.",
      });
    }

    const now = new Date();

    const result = await db.transaction(async (tx) => {
      // Lock the box row so assignment cannot change during this reading.
      const [currentBox] = await tx
        .select({
          id: iotBoxes.id,
          donationId: iotBoxes.donationId,
          isActive: iotBoxes.isActive,
        })
        .from(iotBoxes)
        .where(eq(iotBoxes.id, box.id))
        .limit(1)
        .for("update");

      if (!currentBox || !currentBox.isActive) {
        throw new Error("BOX_INACTIVE");
      }

      await tx
        .update(iotBoxes)
        .set({
          lastSeenAt: now,
          updatedAt: now,
        })
        .where(eq(iotBoxes.id, currentBox.id));

      if (currentBox.donationId == null) {
        return {
          unassigned: true,
          readingId: null,
          donationId: null,
        };
      }

      const [reading] = await tx
        .insert(iotReadings)
        .values({
          boxId: currentBox.id,
          donationId: currentBox.donationId,
          temperature: temperature ?? null,
          foodTemperature: foodTemperature ?? null,
          humidity: humidity ?? null,
          doorOpen: doorOpen ?? null,
          doorOpenCount: doorOpenCount ?? null,
          batteryPercent: batteryPercent ?? null,
          recordedAt,
        })
        .returning({ id: iotReadings.id });

      return {
        unassigned: false,
        readingId: reading.id,
        donationId: currentBox.donationId,
      };
    });

    return res.status(201).json({
      success: true,
      message: result.unassigned
        ? "Box heartbeat received; no donation is assigned."
        : "IoT reading saved.",
      readingId: result.readingId,
      donationId: result.donationId,
      boxCode,
      receivedAt: now.toISOString(),
    });
  } catch (error) {
    if (error.message === "BOX_INACTIVE") {
      return res.status(401).json({
        success: false,
        message: "IoT box is inactive.",
      });
    }

    console.error("receiveIoTReading:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save IoT reading.",
    });
  }
};

// Internal helper: call this INSIDE the transaction that creates a delivery.
// Returns null when no active, unassigned box exists.

export const autoAssignAvailableIoTBox = async (tx, donationId) => {
    if (!donationId) {
        throw new Error("A valid donation ID is required to assign an IoT box.");
    }

    // 1. Return the existing active assignment if one exists.
    const [existingAssignment] = await tx
        .select({
            assignment: iotBoxAssignments,
            box: iotBoxes,
        })
        .from(iotBoxAssignments)
        .innerJoin(
            iotBoxes,
            eq(iotBoxAssignments.boxId, iotBoxes.id)
        )
        .where(
            and(
                eq(iotBoxAssignments.donationId, donationId),
                isNull(iotBoxAssignments.returnedAt)
            )
        )
        .orderBy(desc(iotBoxAssignments.assignedAt))
        .limit(1);

    if (existingAssignment) {
        return {
            alreadyAssigned: true,
            box: existingAssignment.box,
            assignment: existingAssignment.assignment,
        };
    }

    // 2. Check whether a box is linked to this donation already.
    // Repair missing assignment history instead of assigning a second box.
    const [linkedBox] = await tx
        .select()
        .from(iotBoxes)
        .where(eq(iotBoxes.donationId, donationId))
        .limit(1);

    if (linkedBox) {
        const [assignment] = await tx
            .insert(iotBoxAssignments)
            .values({
                boxId: linkedBox.id,
                donationId,
            })
            .returning();

        return {
            alreadyAssigned: true,
            box: linkedBox,
            assignment,
            repairedAssignmentHistory: true,
        };
    }

    // 3. Find active, currently unassigned boxes.
    const availableBoxes = await tx
        .select({
            id: iotBoxes.id,
        })
        .from(iotBoxes)
        .where(
            and(
                eq(iotBoxes.isActive, true),
                isNull(iotBoxes.donationId)
            )
        )
        .orderBy(iotBoxes.id)
        .limit(10);

    // 4. Atomically claim a box so concurrent requests cannot claim
    // the same box through this function.
    for (const candidate of availableBoxes) {
        const now = new Date();

        const [box] = await tx
            .update(iotBoxes)
            .set({
                donationId,
                updatedAt: now,
            })
            .where(
                and(
                    eq(iotBoxes.id, candidate.id),
                    eq(iotBoxes.isActive, true),
                    isNull(iotBoxes.donationId)
                )
            )
            .returning();

        if (!box) {
            continue;
        }

        const [assignment] = await tx
            .insert(iotBoxAssignments)
            .values({
                boxId: box.id,
                donationId,
            })
            .returning();

        return {
            alreadyAssigned: false,
            box,
            assignment,
        };
    }

    // 5. No free box exists. The delivery may still proceed.
    return null;
};


// Optional admin/manual assignment endpoint.
export const assignIoTBox = async (req, res) => {
  try {
    const boxId = Number(req.body?.boxId);
    const donationId = Number(req.body?.donationId);

    if (
      !Number.isSafeInteger(boxId) ||
      boxId <= 0 ||
      !Number.isSafeInteger(donationId) ||
      donationId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid boxId and donationId are required.",
      });
    }

    const result = await db.transaction(async (tx) => {
      const [donation] = await tx
        .select({
          id: donations.donation_id,
          status: donations.donationStatus,
        })
        .from(donations)
        .where(eq(donations.donation_id, donationId))
        .limit(1);

      if (!donation) throw new Error("DONATION_NOT_FOUND");
      if (donation.status !== "accepted") {
        throw new Error("DONATION_NOT_READY");
      }

      const [existing] = await tx
        .select({ id: iotBoxAssignments.id })
        .from(iotBoxAssignments)
        .where(
          and(
            eq(iotBoxAssignments.donationId, donationId),
            isNull(iotBoxAssignments.returnedAt)
          )
        )
        .limit(1);

      if (existing) throw new Error("DONATION_ALREADY_ASSIGNED");

      const [box] = await tx
        .update(iotBoxes)
        .set({
          donationId,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(iotBoxes.id, boxId),
            eq(iotBoxes.isActive, true),
            isNull(iotBoxes.donationId)
          )
        )
        .returning({
          id: iotBoxes.id,
          boxCode: iotBoxes.boxCode,
          donationId: iotBoxes.donationId,
        });

      if (!box) throw new Error("BOX_UNAVAILABLE");

      const [assignment] = await tx
        .insert(iotBoxAssignments)
        .values({ boxId: box.id, donationId })
        .returning({
          id: iotBoxAssignments.id,
          assignedAt: iotBoxAssignments.assignedAt,
        });

      return { box, assignment };
    });

    return res.status(201).json({
      success: true,
      message: "IoT box assigned successfully.",
      data: {
        ...result.box,
        assignmentId: result.assignment.id,
        assignedAt: result.assignment.assignedAt,
      },
    });
  } catch (error) {
    if (sendKnownError(res, error)) return;

    console.error("assignIoTBox:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign IoT box.",
    });
  }
};
