
import { randomBytes } from "crypto";
import { desc, eq, and, isNotNull } from "drizzle-orm";

import { db } from "../config/dbClient";
import { users } from "../model/userSchema";
import { ngos } from "../model/ngoRegisterSchema";
import { donations } from "../model/donationSchema";
import { donationRequests } from "../model/donationRequestSchema";
import { deliveries } from "../model/deliverySchema";
import { deliveryPartners } from "../model/deliveryPartnerSchema";
import { distanceInKm } from "../utils/distance";
import { autoAssignAvailableIoTBox } from "./iotAdmin";
export const getDashboard = async (req, res) => {
    try {
        const [user] = await db
            .select({
                id: users.id,
                role: users.role,
            })
            .from(users)
            .where(eq(users.publicId, req.user.id))
            .limit(1);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.role !== "ngo") {
            return res.status(403).json({
                success: false,
                message: "NGO account required.",
            });
        }

        const [ngo] = await db
            .select({ id: ngos.id })
            .from(ngos)
            .where(eq(ngos.userId, user.id))
            .limit(1);

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: "NGO profile not found.",
            });
        }

        const requestRows = await db
            .select({
                requestId: donationRequests.id,
                requestStatus: donationRequests.status,
                requestedAt: donationRequests.createdAt,
                donationId: donations.donation_id,
                foodName: donations.foodName,
                foodType: donations.foodType,
                quantity: donations.quantity,
                preparedAt: donations.dateTime,
                expectedExpiryTime: donations.expectedExpiryTime,
            })
            .from(donationRequests)
            .leftJoin(
                donations,
                eq(donationRequests.donationId, donations.donation_id)
            )
            .where(eq(donationRequests.ngoId, ngo.id))
            .orderBy(desc(donationRequests.createdAt));

        const deliveryRows = await db
            .select({
                deliveryId: deliveries.id,
                requestId: deliveries.requestId,
                status: deliveries.status,
                createdAt: deliveries.createdAt,
                assignedAt: deliveries.assignedAt,
                deliveredAt: deliveries.deliveredAt,
            })
            .from(deliveries)
            .innerJoin(
                donationRequests,
                eq(deliveries.requestId, donationRequests.id)
            )
            .where(eq(donationRequests.ngoId, ngo.id))
            .orderBy(desc(deliveries.createdAt));

        const totalRequests = requestRows.length;

        const pendingRequests = requestRows.filter(
            (request) => request.requestStatus === "pending"
        ).length;

        const activeDeliveries = deliveryRows.filter(
            (delivery) =>
                ["pending", "assigned", "in_transit"].includes(
                    delivery.status
                )
        ).length;

        const completedDeliveries = deliveryRows.filter(
            (delivery) => delivery.status === "delivered"
        ).length;

        const recentRequests = requestRows.slice(0, 5).map((request) => ({
            requestId: request.requestId,
            status: request.requestStatus,
            requestedAt: request.requestedAt,
            donation: request.donationId
                ? {
                    id: request.donationId,
                    foodName: request.foodName,
                    foodType: request.foodType,
                    quantity: request.quantity,
                    preparedAt: request.preparedAt,
                    expectedExpiryTime: request.expectedExpiryTime,
                }
                : null,
        }));

        return res.status(200).json({
            success: true,
            stats: {
                totalRequests,
                pendingRequests,
                activeDeliveries,
                completedDeliveries,
            },
            recentRequests,
            deliveries: deliveryRows.slice(0, 5),
        });
    } catch (error) {
        console.error("Fetching NGO dashboard failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch NGO dashboard.",
        });
    }
};


export const getRequest = async (req, res) => {
    try {
        const [user] = await db
            .select({
                id: users.id,
                role: users.role,
            })
            .from(users)
            .where(eq(users.publicId, req.user.id))
            .limit(1);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.role !== "ngo") {
            return res.status(403).json({
                success: false,
                message: "NGO account required.",
            });
        }

        const [ngo] = await db
            .select({ id: ngos.id })
            .from(ngos)
            .where(eq(ngos.userId, user.id))
            .limit(1);

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: "NGO profile not found.",
            });
        }

        const rows = await db
            .select({
                request: donationRequests,
                donation: donations,
                delivery: deliveries,
            })
            .from(donationRequests)
            .leftJoin(
                donations,
                eq(donationRequests.donationId, donations.donation_id)
            )
            .leftJoin(
                deliveries,
                eq(deliveries.requestId, donationRequests.id)
            )
            .where(eq(donationRequests.ngoId, ngo.id))
            .orderBy(desc(donationRequests.createdAt));

        const requests = rows.map(({ request, donation, delivery }) => ({
            requestId: request.id,
            status: request.status,
            requestedAt: request.createdAt ?? null,

            donation: donation
                ? {
                    donationId: donation.donation_id,
                    foodName: donation.foodName,
                    foodType: donation.foodType,
                    quantity: donation.quantity,
                    ingredients: donation.ingredients,
                    preparedAt: donation.dateTime,
                    expectedExpiryTime: donation.expectedExpiryTime,
                    donationStatus: donation.donationStatus,
                }
                : null,

            delivery: delivery
                ? {
                    id: delivery.id,
                    status: delivery.status,
                    assignedAt: delivery.assignedAt,
                    pickupScannedAt: delivery.pickupScannedAt,
                    handoverScannedAt: delivery.handoverScannedAt,
                    deliveredAt: delivery.deliveredAt,
                }
                : null,
        }));

        return res.status(200).json({
            success: true,
            requests,
        });
    } catch (error) {
        console.error("Fetching NGO requests failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch donation requests.",
        });
    }
};



export const updateRequestStatus = async (req, res) => {
    try {
        const requestId = Number(req.params.id);

        if (!Number.isInteger(requestId) || requestId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID.",
            });
        }

        let { status } = req.body;

        if (status === "rejected") {
            status = "declined";
        }

        if (!["accepted", "declined"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be accepted or declined.",
            });
        }

        const [user] = await db
            .select({
                id: users.id,
                role: users.role,
            })
            .from(users)
            .where(eq(users.publicId, req.user.id))
            .limit(1);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.role !== "ngo") {
            return res.status(403).json({
                success: false,
                message: "NGO account required.",
            });
        }

        const [ngo] = await db
            .select()
            .from(ngos)
            .where(eq(ngos.userId, user.id))
            .limit(1);

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: "NGO profile not found.",
            });
        }

        const result = await db.transaction(async (tx) => {
            // Update only this NGO's pending request.
            const [updatedRequest] = await tx
                .update(donationRequests)
                .set({
                    status,
                    respondedAt: new Date(),
                })
                .where(
                    and(
                        eq(donationRequests.id, requestId),
                        eq(donationRequests.ngoId, ngo.id),
                        eq(donationRequests.status, "pending")
                    )
                )
                .returning({
                    id: donationRequests.id,
                    donationId: donationRequests.donationId,
                    status: donationRequests.status,
                });

            if (!updatedRequest) {
                const error = new Error(
                    "Request not found for this NGO, or already responded to."
                );
                error.statusCode = 409;
                throw error;
            }

            // Declining a request must not create a delivery or assign a box.
            if (status === "declined") {
                return {
                    request: updatedRequest,
                    delivery: null,
                    iotBoxAssigned: false,
                    message: "Request declined successfully.",
                };
            }

            // Mark the donation as accepted.
            await tx
                .update(donations)
                .set({
                    donationStatus: "accepted",
                })
                .where(
                    eq(
                        donations.donation_id,
                        updatedRequest.donationId
                    )
                );

            // Generate secure QR tokens for the delivery.
            const pickupQrToken = randomBytes(32).toString("hex");
            const handoverQrToken = randomBytes(32).toString("hex");

            // Create the delivery inside this transaction.
            const [delivery] = await tx
                .insert(deliveries)
                .values({
                    requestId: updatedRequest.id,
                    pickupQrToken,
                    handoverQrToken,
                    status: "pending",
                })
                .returning();

            // AUTOMATIC IoT BOX ASSIGNMENT.
            // Use the donation ID from the actual donation request.
            // If no box is available, the delivery can still proceed.
            const iotAssignment = await autoAssignAvailableIoTBox(
                tx,
                updatedRequest.donationId
            );

            // Find verified, available delivery partners with coordinates.
            const availablePartners = await tx
                .select({
                    id: deliveryPartners.id,
                    latitude: deliveryPartners.latitude,
                    longitude: deliveryPartners.longitude,
                })
                .from(deliveryPartners)
                .where(
                    and(
                        eq(deliveryPartners.isVerified, true),
                        eq(deliveryPartners.isAvailable, true),
                        isNotNull(deliveryPartners.latitude),
                        isNotNull(deliveryPartners.longitude)
                    )
                );

            // Sort partners by distance when coordinates are usable.
            const ngoHasCoordinates =
                ngo.latitude != null &&
                ngo.longitude != null &&
                Number.isFinite(Number(ngo.latitude)) &&
                Number.isFinite(Number(ngo.longitude));

            const sortedPartners = ngoHasCoordinates
                ? [...availablePartners].sort((a, b) => {
                    const distanceA = distanceInKm(
                        Number(ngo.latitude),
                        Number(ngo.longitude),
                        Number(a.latitude),
                        Number(a.longitude)
                    );

                    const distanceB = distanceInKm(
                        Number(ngo.latitude),
                        Number(ngo.longitude),
                        Number(b.latitude),
                        Number(b.longitude)
                    );

                    return distanceA - distanceB;
                })
                : availablePartners;

            let assignedDelivery = delivery;

            // Claim an available partner; try another if the claim fails.
            for (const partner of sortedPartners) {
                const [claimedPartner] = await tx
                    .update(deliveryPartners)
                    .set({
                        isAvailable: false,
                    })
                    .where(
                        and(
                            eq(deliveryPartners.id, partner.id),
                            eq(deliveryPartners.isVerified, true),
                            eq(deliveryPartners.isAvailable, true)
                        )
                    )
                    .returning({
                        id: deliveryPartners.id,
                    });

                if (!claimedPartner) {
                    continue;
                }

                const [updatedDelivery] = await tx
                    .update(deliveries)
                    .set({
                        deliveryPartnerId: claimedPartner.id,
                        status: "assigned",
                        assignedAt: new Date(),
                    })
                    .where(eq(deliveries.id, delivery.id))
                    .returning();

                if (!updatedDelivery) {
                    const error = new Error(
                        "Failed to assign the delivery."
                    );
                    error.statusCode = 500;
                    throw error;
                }

                assignedDelivery = updatedDelivery;
                break;
            }

            return {
                request: updatedRequest,
                delivery: assignedDelivery,
                iotBoxAssigned: Boolean(iotAssignment),
                message:
                    assignedDelivery.status === "assigned"
                        ? "Request accepted, delivery partner assigned, and IoT box assignment processed."
                        : "Request accepted. Waiting for an available delivery partner. IoT box assignment processed.",
            };
        });

        return res.status(200).json({
            success: true,
            message: result.message,
            request: result.request,
            delivery: result.delivery
                ? {
                    id: result.delivery.id,
                    status: result.delivery.status,
                    deliveryPartnerId:
                        result.delivery.deliveryPartnerId,
                    assignedAt: result.delivery.assignedAt,
                }
                : null,
            iotBoxAssigned: result.iotBoxAssigned,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        console.error("Updating NGO request failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update request status.",
        });
    }
};


export const getMyDeliveries = async (req, res) => {
    try {
        const [user] = await db
            .select({
                id: users.id,
                role: users.role,
            })
            .from(users)
            .where(eq(users.publicId, req.user.id))
            .limit(1);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        if (user.role !== "ngo") {
            return res.status(403).json({
                success: false,
                message: "NGO account required.",
            });
        }

        const [ngo] = await db
            .select({ id: ngos.id })
            .from(ngos)
            .where(eq(ngos.userId, user.id))
            .limit(1);

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: "NGO profile not found.",
            });
        }

        const rows = await db
            .select({
                delivery: deliveries,
                request: donationRequests,
                donation: donations,
                partner: deliveryPartners,
            })
            .from(deliveries)
            .innerJoin(
                donationRequests,
                eq(deliveries.requestId, donationRequests.id)
            )
            .innerJoin(
                donations,
                eq(donationRequests.donationId, donations.donation_id)
            )
            .leftJoin(
                deliveryPartners,
                eq(deliveries.deliveryPartnerId, deliveryPartners.id)
            )
            .where(eq(donationRequests.ngoId, ngo.id))
            .orderBy(desc(deliveries.createdAt));

        const result = rows.map(
            ({ delivery, request, donation, partner }) => ({
                deliveryId: delivery.id,
                requestId: request.id,
                status: delivery.status,
                requestStatus: request.status,
                assignedAt: delivery.assignedAt,
                pickupScannedAt: delivery.pickupScannedAt,
                handoverScannedAt: delivery.handoverScannedAt,
                deliveredAt: delivery.deliveredAt,

                // Only expose the handover QR during transit.
                handoverQrToken:
                    delivery.status === "in_transit"
                        ? delivery.handoverQrToken
                        : null,

                food: {
                    id: donation.donation_id,
                    name: donation.foodName,
                    type: donation.foodType,
                    quantity: donation.quantity,
                    ingredients: donation.ingredients,
                    preparedAt: donation.dateTime,
                    expectedExpiryTime: donation.expectedExpiryTime,
                },

                partner: partner
                    ? {
                        name: partner.fullName,
                        vehicleType: partner.vehicleType,
                        vehicleNumber: partner.vehicleNumber,
                    }
                    : null,
            })
        );

        return res.status(200).json({
            success: true,
            deliveries: result,
        });
    } catch (error) {
        console.error("Fetching NGO deliveries failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch NGO deliveries.",
        });
    }
};
