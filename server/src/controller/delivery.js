
import { eq, and } from "drizzle-orm";
import { users } from "../model/userSchema";
import { deliveryPartners } from "../model/deliveryPartnerSchema";
import { deliveries } from "../model/deliverySchema";
import { donationRequests } from "../model/donationRequestSchema";
import { donations } from "../model/donationSchema";
import { ngos } from "../model/ngoRegisterSchema";
import { db } from "../config/dbClient";

export const updatePartnerAvailability = async (req, res) => {
  try {
    const { isAvailable, latitude, longitude } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Availability must be true or false.",
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
        message: "Delivery partner account required.",
      });
    }

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

    if (!partner.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Admin verification is required.",
      });
    }

    if (isAvailable) {
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
        return res.status(400).json({
          success: false,
          message: "Valid latitude and longitude are required.",
        });
      }

      // Prevent going online while a delivery is active.
      const [activeDelivery] = await db
        .select({ id: deliveries.id })
        .from(deliveries)
        .where(
          and(
            eq(deliveries.deliveryPartnerId, partner.id),
            eq(deliveries.status, "assigned")
          )
        )
        .limit(1);

      const [inTransitDelivery] = await db
        .select({ id: deliveries.id })
        .from(deliveries)
        .where(
          and(
            eq(deliveries.deliveryPartnerId, partner.id),
            eq(deliveries.status, "in_transit")
          )
        )
        .limit(1);

      if (activeDelivery || inTransitDelivery) {
        return res.status(409).json({
          success: false,
          message:
            "Complete your active delivery before becoming available.",
        });
      }

      const [updatedPartner] = await db
        .update(deliveryPartners)
        .set({
          latitude,
          longitude,
          isAvailable: true,
        })
        .where(eq(deliveryPartners.id, partner.id))
        .returning({
          id: deliveryPartners.id,
          latitude: deliveryPartners.latitude,
          longitude: deliveryPartners.longitude,
          isAvailable: deliveryPartners.isAvailable,
        });

      return res.status(200).json({
        success: true,
        message: "You are now available for deliveries.",
        partner: updatedPartner,
      });
    }

    // Going offline does not require new coordinates.
    const [updatedPartner] = await db
      .update(deliveryPartners)
      .set({ isAvailable: false })
      .where(eq(deliveryPartners.id, partner.id))
      .returning({
        id: deliveryPartners.id,
        isAvailable: deliveryPartners.isAvailable,
      });

    return res.status(200).json({
      success: true,
      message: "You are now unavailable for deliveries.",
      partner: updatedPartner,
    });
  } catch (error) {
    console.error("Updating partner availability failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update availability.",
    });
  }
};

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

      // The partner must explicitly choose to become available again.
      await tx
        .update(deliveryPartners)
        .set({ isAvailable: false })
        .where(eq(deliveryPartners.id, partner.id));

      return {
        status: "delivered",
        message: "Handover scan recorded successfully.",
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

export const getMyDeliveries = async (req, res) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.publicId, req.user.id))
      .limit(1);

    if (!user || user.role !== "delivery_partner") {
      return res.status(403).json({
        success: false,
        message: "Delivery partner account required.",
      });
    }

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

    const rows = await db
      .select({
        delivery: deliveries,
        request: donationRequests,
        donation: donations,
        ngo: ngos,
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
      .innerJoin(
        ngos,
        eq(donationRequests.ngoId, ngos.id)
      )
      .where(eq(deliveries.deliveryPartnerId, partner.id));

    return res.status(200).json({
      success: true,
      isAvailable: partner.isAvailable,
      deliveries: rows.map(({ delivery, request, donation, ngo }) => ({
        id: delivery.id,
        status: delivery.status,
        assignedAt: delivery.assignedAt,
        pickupScannedAt: delivery.pickupScannedAt,
        handoverScannedAt: delivery.handoverScannedAt,
        donation: {
          donationId: donation.donation_id,
          foodName: donation.foodName,
          foodType: donation.foodType,
          quantity: donation.quantity,
          expectedExpiryTime: donation.expectedExpiryTime,
        },
        ngo: {
          id: ngo.id,
          name: ngo.name,
        },
        requestStatus: request.status,
      })),
    });
  } catch (error) {
    console.error("Fetching partner deliveries failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch deliveries.",
    });
  }
};
