import { desc, eq } from "drizzle-orm";
import { db } from "../config/dbClient.js";
import { iotBoxes, iotReadings, iotAlerts } from "../model/iotSchema.js";
import { donations } from "../model/donationSchema.js";
import { donors } from "../model/donorRegisterSchema.js";
import { donationRequests } from "../model/donationRequestSchema.js";
import { deliveries } from "../model/deliverySchema.js";
import { deliveryPartners } from "../model/deliveryPartnerSchema.js";
import { ngos } from "../model/ngoRegisterSchema.js";
import { users } from "../model/userSchema.js";

const HEARTBEAT_TIMEOUT_MS = 2 * 60 * 1000;

const getBoxStatus = (lastSeenAt, now = Date.now()) => {
    if (!lastSeenAt) return "offline";

    return now - new Date(lastSeenAt).getTime() <= HEARTBEAT_TIMEOUT_MS
        ? "online"
        : "offline";
};

// GET /api/admin/iot/overview
export const getIoTOverview = async (req, res) => {
    try {
        const boxes = await db
            .select({
                id: iotBoxes.id,
                boxCode: iotBoxes.boxCode,
                isActive: iotBoxes.isActive,
                lastSeenAt: iotBoxes.lastSeenAt,
            })
            .from(iotBoxes);

        const now = Date.now();

        const online = boxes.filter(
            (box) => box.isActive && getBoxStatus(box.lastSeenAt, now) === "online"
        ).length;

        const [activeAlerts] = await db
            .select({ count: iotAlerts.id })
            .from(iotAlerts)
            .where(eq(iotAlerts.status, "active"));

        return res.status(200).json({
            success: true,
            data: {
                totalBoxes: boxes.length,
                onlineBoxes: online,
                offlineBoxes: boxes.length - online,
                activeAlerts: activeAlerts?.count ?? 0,
            },
        });
    } catch (error) {
        console.error("getIoTOverview error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load IoT overview.",
        });
    }
};

// GET /api/admin/iot/boxes
export const getIoTBoxes = async (req, res) => {
    try {
        const boxes = await db
            .select({
                id: iotBoxes.id,
                boxCode: iotBoxes.boxCode,
                isActive: iotBoxes.isActive,
                lastSeenAt: iotBoxes.lastSeenAt,
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
                const [reading] = await db
                    .select()
                    .from(iotReadings)
                    .where(eq(iotReadings.boxId, box.id))
                    .orderBy(desc(iotReadings.recordedAt))
                    .limit(1);

                let ngoName = null;
                let deliveryPartnerName = null;
                let deliveryStatus = null;

                if (box.donationId) {
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
                        .where(eq(donationRequests.donationId, box.donationId))
                        .orderBy(desc(donationRequests.createdAt))
                        .limit(1);

                    ngoName = assignment?.ngoName ?? null;
                    deliveryPartnerName =
                        assignment?.deliveryPartnerName ?? null;
                    deliveryStatus = assignment?.deliveryStatus ?? null;
                }

                return {
                    ...box,
                    status: box.isActive
                        ? getBoxStatus(box.lastSeenAt)
                        : "inactive",
                    latestReading: reading ?? null,
                    ngoName,
                    deliveryPartnerName,
                    deliveryStatus,
                };
            })
        );

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("getIoTBoxes error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load IoT boxes.",
        });
    }
};

// GET /api/admin/iot/alerts
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
            .innerJoin(iotBoxes, eq(iotAlerts.boxId, iotBoxes.id))
            .orderBy(desc(iotAlerts.createdAt));

        return res.status(200).json({ success: true, data: alerts });
    } catch (error) {
        console.error("getIoTAlerts error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load IoT alerts.",
        });
    }
};
