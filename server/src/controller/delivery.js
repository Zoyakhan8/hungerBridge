
import { eq, and } from "drizzle-orm";
import { users } from "../model/userSchema";
import { deliveryPartners } from "../model/deliveryPartnerSchema";
import { deliveries } from "../model/deliverySchema";
import { donationRequests } from "../model/donationRequestSchema";
import { donations } from "../model/donationSchema";
import { ngos } from "../model/ngoRegisterSchema";
import { db } from "../config/dbClient";

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
      .where(eq(users.publicId, req.user.id));

    if (!user || user.role !== "delivery_partner") {
      return res.status(403).json({
        success: false,
        message: "Only delivery partners can scan deliveries.",
      });
    }

    const [partner] = await db
      .select()
      .from(deliveryPartners)
      .where(eq(deliveryPartners.userId, user.id));

    if (!partner || !partner.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Verified delivery partner account required.",
      });
    }

    const token = qrToken.trim();

    const result = await db.transaction(async (tx) => {
      // First, try the pickup QR.
      const [pickupDelivery] = await tx
        .select()
        .from(deliveries)
        .where(eq(deliveries.pickupQrToken, token));

      if (pickupDelivery) {
        if (pickupDelivery.deliveryPartnerId !== partner.id) {
          const error = new Error(
            "This delivery is not assigned to your account."
          );
          error.statusCode = 403;
          throw error;
        }

        if (pickupDelivery.status !== "assigned") {
          const error = new Error(
            `Pickup cannot be scanned when status is ${pickupDelivery.status}.`
          );
          error.statusCode = 409;
          throw error;
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
          .returning();

        if (!updated) {
          const error = new Error("Delivery changed. Please scan again.");
          error.statusCode = 409;
          throw error;
        }

        return {
          status: "in_transit",
          message: "Pickup scan recorded successfully.",
        };
      }

      // If it isn't a pickup QR, try the NGO handover QR.
      const [handoverDelivery] = await tx
        .select()
        .from(deliveries)
        .where(eq(deliveries.handoverQrToken, token));

      if (!handoverDelivery) {
        const error = new Error("Invalid QR code.");
        error.statusCode = 404;
        throw error;
      }

      if (handoverDelivery.deliveryPartnerId !== partner.id) {
        const error = new Error(
          "This delivery is not assigned to your account."
        );
        error.statusCode = 403;
        throw error;
      }

      if (handoverDelivery.status !== "in_transit") {
        const error = new Error(
          `Handover cannot be scanned when status is ${handoverDelivery.status}.`
        );
        error.statusCode = 409;
        throw error;
      }

      const [updated] = await tx
        .update(deliveries)
        .set({
          status: "delivered",
          handoverScannedAt: new Date(),
          deliveredAt: new Date(),
        })
        .where(
          and(
            eq(deliveries.id, handoverDelivery.id),
            eq(deliveries.status, "in_transit")
          )
        )
        .returning();

      if (!updated) {
        const error = new Error("Delivery changed. Please scan again.");
        error.statusCode = 409;
        throw error;
      }

      await tx
        .update(deliveryPartners)
        .set({ isAvailable: true })
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
    if (error.statusCode) {
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
      .where(eq(users.publicId, req.user.id));

    if (!user || user.role !== "delivery_partner") {
      return res.status(403).json({
        success: false,
        message: "Delivery partner account required.",
      });
    }

    const [partner] = await db
      .select()
      .from(deliveryPartners)
      .where(eq(deliveryPartners.userId, user.id));

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

