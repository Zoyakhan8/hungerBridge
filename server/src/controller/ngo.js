import { donationRequests } from "../model/donationRequestSchema";
import { donations } from "../model/donationSchema";
import { ngos } from "../model/ngoRegisterSchema";
import { users } from "../model/userSchema";
import { db } from "../config/dbClient";
import { desc, eq, and } from "drizzle-orm";
import { deliveryPartners } from "../model/deliveryPartnerSchema";
import { deliveries } from "../model/deliverySchema";
import { randomBytes } from "crypto";
export const getRequest = async (req, res) => {
    try {
        const userPublicId = req.user.id;
        console.log(userPublicId, "sns")
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.publicId, userPublicId));

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        const [ngo] = await db
            .select()
            .from(ngos)
            .where(eq(ngos.userId, user.id));

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: "NGO profile not found.",
            });
        }

        // Fetch every request belonging to this NGO, with its donation.
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
            .where(eq(donationRequests.ngoId, ngo.id));

        const requests = rows.map(({ request, donation }) => ({
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
        }));
        console.log("shhs")
        console.log(requests)
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
        const userPublicId = req.user.id;
        const requestId = Number(req.params.id);

        if (!Number.isInteger(requestId) || requestId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid request ID.",
            });
        }

        let { status } = req.body;

        if (status === "rejected") status = "declined";

        if (!["accepted", "declined"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be accepted or declined.",
            });
        }

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.publicId, userPublicId));

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        const [ngo] = await db
            .select()
            .from(ngos)
            .where(eq(ngos.userId, user.id));

        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: "NGO profile not found.",
            });
        }

        const result = await db.transaction(async (tx) => {
            // Only this NGO can respond to its own pending request.
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
                    status: donationRequests.status,
                });

            if (!updatedRequest) {
                const error = new Error(
                    "Request not found for this NGO, or already responded to."
                );
                error.statusCode = 409;
                throw error;
            }

            // Declining a request does not create a delivery.
            if (status === "declined") {
                return {
                    request: updatedRequest,
                    delivery: null,
                };
            }

            // Create a delivery with a random QR token.
            const pickupQrToken = randomBytes(32).toString("hex");
            const handoverQrToken = randomBytes(32).toString("hex");

            const [delivery] = await tx
                .insert(deliveries)
                .values({
                    requestId,
                    pickupQrToken,
                    handoverQrToken,
                    status: "pending",
                })
                .returning();

            // Find a verified partner who is currently available.
            const [partner] = await tx
                .select()
                .from(deliveryPartners)
                .where(
                    and(
                        eq(deliveryPartners.isVerified, true),
                        eq(deliveryPartners.isAvailable, true)
                    )
                )
                .limit(1);

            let assignedDelivery = delivery;

            if (partner) {
                // Claim the partner only if they are still available.
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

                if (claimedPartner) {
                    const [updatedDelivery] = await tx
                        .update(deliveries)
                        .set({
                            deliveryPartnerId: claimedPartner.id,
                            status: "assigned",
                            assignedAt: new Date(),
                        })
                        .where(eq(deliveries.id, delivery.id))
                        .returning();

                    assignedDelivery = updatedDelivery;
                }
            }

            return {
                request: updatedRequest,
                delivery: assignedDelivery,
            };
        });

        return res.status(200).json({
            success: true,
            message:
                status === "accepted"
                    ? "Request accepted and delivery created."
                    : "Request declined successfully.",
            request: result.request,
            delivery: result.delivery
                ? {
                    id: result.delivery.id,
                    status: result.delivery.status,
                    deliveryPartnerId: result.delivery.deliveryPartnerId,
                    assignedAt: result.delivery.assignedAt,
                }
                : null,
        });
    } catch (error) {
        if (error.statusCode === 409) {
            return res.status(409).json({
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
        // req.user.id is the user's public UUID in your application.
        const [user] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.publicId, req.user.id));

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        const [ngo] = await db
            .select({ id: ngos.id })
            .from(ngos)
            .where(eq(ngos.userId, user.id));

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

        const result = rows.map(({ delivery, request, donation, partner }) => ({
            deliveryId: delivery.id,
            requestId: request.id,
            status: delivery.status,
            requestStatus: request.status,
            assignedAt: delivery.assignedAt,
            pickupScannedAt: delivery.pickupScannedAt,
            handoverScannedAt: delivery.handoverScannedAt,
            deliveredAt: delivery.deliveredAt,

            // Only return the handover token to this authenticated NGO.
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
        }));

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
