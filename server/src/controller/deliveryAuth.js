
import { eq, or } from "drizzle-orm";
import argon2 from "argon2";

import { db } from "../config/dbClient";
import { users } from "../model/userSchema";
import { deliveryPartners } from "../model/deliveryPartnerSchema";

const allowedVehicles = [
  "bike",
  "bicycle",
  "car",
  "van",
  "other",
];

export const registerDeliveryPartner = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      vehicleType,
      vehicleNumber,
      password,
    } = req.body;

    // Validate required fields.
    if (
      typeof fullName !== "string" ||
      !fullName.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof phoneNumber !== "string" ||
      !phoneNumber.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    if (fullName.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Full name is too long.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (
      vehicleType &&
      !allowedVehicles.includes(vehicleType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle type.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phoneNumber.trim();

    // Check for existing email or phone number.
    const [existingUser] = await db
      .select({
        id: users.id,
        email: users.email,
        phoneNumber: users.phoneNumber,
      })
      .from(users)
      .where(
        or(
          eq(users.email, normalizedEmail),
          eq(users.phoneNumber, normalizedPhone)
        )
      )
      .limit(1);

    if (existingUser) {
      const message =
        existingUser.email === normalizedEmail
          ? "An account with this email already exists."
          : "An account with this phone number already exists.";

      return res.status(409).json({
        success: false,
        message,
      });
    }

    const hashedPassword = await argon2.hash(password);

    const result = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email: normalizedEmail,
          phoneNumber: normalizedPhone,
          password: hashedPassword,
          role: "delivery_partner",
        })
        .returning({
          id: users.id,
          publicId: users.publicId,
          email: users.email,
          role: users.role,
        });

      const [partner] = await tx
        .insert(deliveryPartners)
        .values({
          userId: user.id,
          fullName: fullName.trim(),
          vehicleType: vehicleType || "bike",
          vehicleNumber:
            typeof vehicleNumber === "string" &&
            vehicleNumber.trim()
              ? vehicleNumber.trim().toUpperCase()
              : null,
          isAvailable: true,
          isVerified: false,
        })
        .returning({
          id: deliveryPartners.id,
          fullName: deliveryPartners.fullName,
          isVerified: deliveryPartners.isVerified,
        });

      return { user, partner };
    });

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully. Please wait for admin verification.",
      user: {
        id: result.user.publicId,
        email: result.user.email,
        role: result.user.role,
      },
      deliveryPartner: result.partner,
    });
  } catch (error) {
    // A unique constraint may be hit if concurrent registrations
    // attempt to use the same email.
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "An account with these details already exists.",
      });
    }

    console.error("Delivery partner registration failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create delivery partner account.",
    });
  }
};

