
import { asc,eq, and, desc, isNull } from "drizzle-orm";
import { users } from "../model/userSchema";
import { deliveryPartners } from "../model/deliveryPartnerSchema";
import { deliveries } from "../model/deliverySchema";
import { donationRequests } from "../model/donationRequestSchema";
import { donations } from "../model/donationSchema";
import { ngos } from "../model/ngoRegisterSchema";
import { db } from "../config/dbClient";
import { iotBoxAssignments,iotReadings,iotBoxes } from "../model/iotSchema";
import { distanceInKm } from "../utils/distance";
const assignPendingDeliveryToPartner = async (tx, partner) => {
    if (
        !partner ||
        !partner.isVerified ||
        !partner.isAvailable ||
        partner.latitude == null ||
        partner.longitude == null
    ) {
        return null;
    }

    const pendingDeliveries = await tx
        .select({
            deliveryId: deliveries.id,
            createdAt: deliveries.createdAt,
            ngoLatitude: ngos.latitude,
            ngoLongitude: ngos.longitude,
        })
        .from(deliveries)
        .innerJoin(
            donationRequests,
            eq(deliveries.requestId, donationRequests.id)
        )
        .innerJoin(
            ngos,
            eq(donationRequests.ngoId, ngos.id)
        )
        .where(
            and(
                eq(deliveries.status, "pending"),
                isNull(deliveries.deliveryPartnerId),
                eq(donationRequests.status, "accepted")
            )
        )
        .orderBy(asc(deliveries.createdAt));

    if (pendingDeliveries.length === 0) {
        return null;
    }

    // Prefer the pending delivery whose NGO is nearest to this partner.
    const hasCoordinates = (item) =>
        item.ngoLatitude != null &&
        item.ngoLongitude != null &&
        Number.isFinite(Number(item.ngoLatitude)) &&
        Number.isFinite(Number(item.ngoLongitude));

    const sortedDeliveries = [...pendingDeliveries].sort((a, b) => {
        if (!hasCoordinates(a)) return 1;
        if (!hasCoordinates(b)) return -1;

        const distanceA = distanceInKm(
            Number(partner.latitude),
            Number(partner.longitude),
            Number(a.ngoLatitude),
            Number(a.ngoLongitude)
        );

        const distanceB = distanceInKm(
            Number(partner.latitude),
            Number(partner.longitude),
            Number(b.ngoLatitude),
            Number(b.ngoLongitude)
        );

        return distanceA - distanceB;
    });

    for (const candidate of sortedDeliveries) {
        // Atomically claim the delivery only if it is still pending.
        const [assignedDelivery] = await tx
            .update(deliveries)
            .set({
                deliveryPartnerId: partner.id,
                status: "assigned",
                assignedAt: new Date(),
            })
            .where(
                and(
                    eq(deliveries.id, candidate.deliveryId),
                    eq(deliveries.status, "pending"),
                    isNull(deliveries.deliveryPartnerId)
                )
            )
            .returning();

        if (!assignedDelivery) {
            continue;
        }

        // Reserve the partner for this delivery.
        const [claimedPartner] = await tx
            .update(deliveryPartners)
            .set({ isAvailable: false })
            .where(
                and(
                    eq(deliveryPartners.id, partner.id),
                    eq(deliveryPartners.isVerified, true),
                    eq(deliveryPartners.isAvailable, true)
                )
            )
            .returning({ id: deliveryPartners.id });

        if (!claimedPartner) {
            // Throwing rolls back the delivery update as well.
            throw new Error(
                "Partner availability changed while assigning delivery."
            );
        }

        return assignedDelivery;
    }

    return null;
};

export const updatePartnerAvailability = async (req, res) => {
    try {
        const { isAvailable, latitude, longitude } = req.body;

        if (typeof isAvailable !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Availability must be true or false.",
            });
        }

        const publicUserId = req.user?.id;

        if (!publicUserId) {
            return res.status(401).json({
                success: false,
                message: "Please log in again.",
            });
        }

        const result = await db.transaction(async (tx) => {
            const [user] = await tx
                .select()
                .from(users)
                .where(eq(users.publicId, publicUserId))
                .limit(1);

            if (!user || user.role !== "delivery_partner") {
                return {
                    error: true,
                    statusCode: 403,
                    message: "Delivery partner account required.",
                };
            }

            const [partner] = await tx
                .select()
                .from(deliveryPartners)
                .where(eq(deliveryPartners.userId, user.id))
                .limit(1);

            if (!partner) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "Delivery partner profile not found.",
                };
            }

            if (!partner.isVerified) {
                return {
                    error: true,
                    statusCode: 403,
                    message: "Admin verification is required.",
                };
            }

            if (!isAvailable) {
                const [updatedPartner] = await tx
                    .update(deliveryPartners)
                    .set({ isAvailable: false })
                    .where(eq(deliveryPartners.id, partner.id))
                    .returning({
                        id: deliveryPartners.id,
                        isAvailable: deliveryPartners.isAvailable,
                    });

                return {
                    success: true,
                    partner: updatedPartner,
                    assignedDelivery: null,
                    message: "You are now unavailable for deliveries.",
                };
            }

            if (
                typeof latitude !== "number" ||
                typeof longitude !== "number" ||
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude) ||
                latitude < -90 ||
                latitude > 90 ||
                longitude < -180 ||
                longitude > 180
            ) {
                return {
                    error: true,
                    statusCode: 400,
                    message: "Valid latitude and longitude are required.",
                };
            }

            // Do not let a partner go online while already handling a delivery.
            const [activeDelivery] = await tx
                .select({ id: deliveries.id })
                .from(deliveries)
                .where(
                    and(
                        eq(deliveries.deliveryPartnerId, partner.id),
                        // An in-transit delivery must be completed first.
                        eq(deliveries.status, "in_transit")
                    )
                )
                .limit(1);

            if (activeDelivery) {
                return {
                    error: true,
                    statusCode: 409,
                    message:
                        "Complete your active delivery before becoming available.",
                };
            }

            // An assigned delivery is also active and cannot be bypassed.
            const [assignedDelivery] = await tx
                .select({ id: deliveries.id })
                .from(deliveries)
                .where(
                    and(
                        eq(deliveries.deliveryPartnerId, partner.id),
                        eq(deliveries.status, "assigned")
                    )
                )
                .limit(1);

            if (assignedDelivery) {
                return {
                    error: true,
                    statusCode: 409,
                    message:
                        "Complete your active delivery before becoming available.",
                };
            }

            const [updatedPartner] = await tx
                .update(deliveryPartners)
                .set({
                    latitude,
                    longitude,
                    isAvailable: true,
                })
                .where(
                    and(
                        eq(deliveryPartners.id, partner.id),
                        eq(deliveryPartners.isVerified, true)
                    )
                )
                .returning();

            if (!updatedPartner) {
                return {
                    error: true,
                    statusCode: 409,
                    message: "Could not update partner availability.",
                };
            }

            // NEW: immediately retry pending delivery assignment.
            const assigned = await assignPendingDeliveryToPartner(
                tx,
                updatedPartner
            );

            if (assigned) {
                return {
                    success: true,
                    partner: {
                        ...updatedPartner,
                        isAvailable: false,
                    },
                    assignedDelivery: {
                        id: assigned.id,
                        status: assigned.status,
                        assignedAt: assigned.assignedAt,
                    },
                    message:
                        `You are online and Delivery #${assigned.id} has been assigned to you.`,
                };
            }

            return {
                success: true,
                partner: updatedPartner,
                assignedDelivery: null,
                message:
                    "You are now available. No eligible pending deliveries are waiting.",
            };
        });

        if (result.error) {
            return res.status(result.statusCode).json({
                success: false,
                message: result.message,
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Updating partner availability failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update availability or assign a pending delivery.",
        });
    }
};

// Scan pickup or NGO handover QR.
export const scanDeliveryQR = async (req, res) => {
  try {
    const { qrToken } = req.body;

    if (typeof qrToken !== "string" || !qrToken.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid QR token is required.",
      });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.publicId, req.user.id))
      .limit(1);

    if (!user || user.role !== "delivery_partner") {
      return res.status(403).json({
        success: false,
        message: "Only delivery partners can scan deliveries.",
      });
    }

    const [partner] = await db
      .select()
      .from(deliveryPartners)
      .where(eq(deliveryPartners.userId, user.id))
      .limit(1);

    if (!partner || !partner.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Verified delivery partner account required.",
      });
    }

    const token = qrToken.trim();

    const result = await db.transaction(async (tx) => {
      // Try the pickup QR first.
      const [pickupDelivery] = await tx
        .select()
        .from(deliveries)
        .where(eq(deliveries.pickupQrToken, token))
        .limit(1);

      if (pickupDelivery) {
        if (pickupDelivery.deliveryPartnerId !== partner.id) {
          throw new HttpError(
            "This delivery is not assigned to your account.",
            403
          );
        }

        if (pickupDelivery.status !== "assigned") {
          throw new HttpError(
            `Pickup cannot be scanned when status is ${pickupDelivery.status}.`,
            409
          );
        }

        const [updated] = await tx
          .update(deliveries)
          .set({
            status: "in_transit",
            pickupScannedAt: new Date(),
          })
          .where(
            and(
              eq(deliveries.id, pickupDelivery.id),
              eq(deliveries.status, "assigned")
            )
          )
          .returning({ id: deliveries.id });

        if (!updated) {
          throw new HttpError(
            "Delivery changed. Please scan again.",
            409
          );
        }

        return {
          status: "in_transit",
          message: "Pickup scan recorded successfully.",
        };
      }

      // Otherwise, try the NGO handover QR.
      const [handoverDelivery] = await tx
        .select()
        .from(deliveries)
        .where(eq(deliveries.handoverQrToken, token))
        .limit(1);

      if (!handoverDelivery) {
        throw new HttpError("Invalid QR code.", 404);
      }

      if (handoverDelivery.deliveryPartnerId !== partner.id) {
        throw new HttpError(
          "This delivery is not assigned to your account.",
          403
        );
      }

      if (handoverDelivery.status !== "in_transit") {
        throw new HttpError(
          `Handover cannot be scanned when status is ${handoverDelivery.status}.`,
          409
        );
      }

      const now = new Date();

      const [updated] = await tx
        .update(deliveries)
        .set({
          status: "delivered",
          handoverScannedAt: now,
          deliveredAt: now,
        })
        .where(
          and(
            eq(deliveries.id, handoverDelivery.id),
            eq(deliveries.status, "in_transit")
          )
        )
        .returning({ id: deliveries.id });

      if (!updated) {
        throw new HttpError(
          "Delivery changed. Please scan again.",
          409
        );
      }

      // Find the donation for this delivery.
      const [request] = await tx
        .select({
          donationId: donationRequests.donationId,
        })
        .from(donationRequests)
        .where(eq(donationRequests.id, handoverDelivery.requestId))
        .limit(1);

      if (!request) {
        throw new HttpError("Donation request not found.", 404);
      }

      // Find the box currently assigned to this donation.
      const [box] = await tx
        .select({
          id: iotBoxes.id,
        })
        .from(iotBoxes)
        .where(eq(iotBoxes.donationId, request.donationId))
        .limit(1);

      if (box) {
        // Close the assignment history.
        await tx
          .update(iotBoxAssignments)
          .set({ returnedAt: now })
          .where(
            and(
              eq(iotBoxAssignments.boxId, box.id),
              eq(iotBoxAssignments.donationId, request.donationId),
              isNull(iotBoxAssignments.returnedAt)
            )
          );

        // Release the box for reuse.
        await tx
          .update(iotBoxes)
          .set({
            donationId: null,
            updatedAt: now,
          })
          .where(
            and(
              eq(iotBoxes.id, box.id),
              eq(iotBoxes.donationId, request.donationId)
            )
          );
      }

      // Require the partner to explicitly become available again.
      await tx
        .update(deliveryPartners)
        .set({ isAvailable: false })
        .where(eq(deliveryPartners.id, partner.id));

      return {
        status: "delivered",
        message:
          "Handover recorded successfully. IoT box released if assigned.",
      };
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error("QR scan failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process QR scan.",
    });
  }
};

// Get deliveries assigned to the logged-in delivery partner.
export const getMyDeliveries = async (req, res) => {
  try {
    const publicUserId = req.user?.id;

    if (!publicUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in again.",
      });
    }

    // Resolve the public UUID to the internal database user.
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.publicId, publicUserId))
      .limit(1);

    if (!user || user.role !== "delivery_partner") {
      return res.status(403).json({
        success: false,
        message: "Delivery partner account required.",
      });
    }

    // Use the internal user ID for the delivery partner lookup.
    const [partner] = await db
      .select()
      .from(deliveryPartners)
      .where(eq(deliveryPartners.userId, user.id))
      .limit(1);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner profile not found.",
      });
    }

    // Fetch deliveries assigned to this partner.
    const partnerDeliveries = await db
      .select()
      .from(deliveries)
      .where(eq(deliveries.deliveryPartnerId, partner.id))
      .orderBy(desc(deliveries.createdAt));

    const result = await Promise.all(
      partnerDeliveries.map(async (delivery) => {
        const [request] = await db
          .select()
          .from(donationRequests)
          .where(eq(donationRequests.id, delivery.requestId))
          .limit(1);

        let donation = null;
        let ngo = null;
        let box = null;
        let latestReading = null;
        let boxAssignment = null;

        if (request) {
          const [foundDonation] = await db
            .select()
            .from(donations)
            .where(
              eq(donations.donation_id, request.donationId)
            )
            .limit(1);

          donation = foundDonation ?? null;

          if (request.ngoId != null) {
            const [foundNgo] = await db
              .select()
              .from(ngos)
              .where(eq(ngos.id, request.ngoId))
              .limit(1);

            ngo = foundNgo ?? null;
          }

          if (donation) {
            // Latest assignment preserves IoT history after release.
            const [assignment] = await db
              .select()
              .from(iotBoxAssignments)
              .where(
                eq(
                  iotBoxAssignments.donationId,
                  donation.donation_id
                )
              )
              .orderBy(desc(iotBoxAssignments.assignedAt))
              .limit(1);

            boxAssignment = assignment ?? null;

            if (boxAssignment) {
              const [foundBox] = await db
                .select()
                .from(iotBoxes)
                .where(eq(iotBoxes.id, boxAssignment.boxId))
                .limit(1);

              box = foundBox ?? null;

              if (box) {
                const [reading] = await db
                  .select()
                  .from(iotReadings)
                  .where(
                    and(
                      eq(iotReadings.boxId, box.id),
                      eq(
                        iotReadings.donationId,
                        donation.donation_id
                      )
                    )
                  )
                  .orderBy(desc(iotReadings.recordedAt))
                  .limit(1);

                latestReading = reading ?? null;
              }
            }
          }
        }

        return {
          ...delivery,
          request,
          donation,
          ngo,
          iot: {
            box,
            assignment: boxAssignment,
            latestReading,
            assigned: Boolean(
              boxAssignment && !boxAssignment.returnedAt
            ),
            releasedAt: boxAssignment?.returnedAt ?? null,
          },
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: result.length,
      deliveries: result,
    });
  } catch (error) {
    console.error("getMyDeliveries error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch deliveries.",
    });
  }
};