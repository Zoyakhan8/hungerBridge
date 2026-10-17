import { eq, inArray,and } from "drizzle-orm"
import { db } from "../config/dbClient"
import { users } from "../model/userSchema"
import { donors } from "../model/donorRegisterSchema"
import { uploadToCloudinary } from "../utils/uploadToCloudinary"
import { donorDocuments, donorFacilities } from "../model/donorDocumentSchema"
import { classifyFood } from "../services/hungerBridgeAi"
import { foodCategory, foodRule } from "../model/foodCategorySchema"
import { donations } from "../model/donationSchema"
import { donationRequests } from "../model/donationRequestSchema"
import { ngos } from "../model/ngoRegisterSchema"
import { geocodeAddress } from "../utils/geocodeAddress";
import { distanceInKm } from "../utils/distance";
import { deliveries } from "../model/deliverySchema";
export const donorDashboard = async (req, res) => {
    const userPublicId = req.user.id
    const [user] = await db.select().from(users).where(eq(users.publicId, userPublicId))
    const userId = user.id
    const [donor] = await db
        .select()
        .from(donors)
        .where(eq(donors.userId, userId));
    if (donor.profileComplete === false) {
        return res.status(200).json({
            success: false,
            donorName: donor.name,
            verified: donor.approved,
            message: `Welcome ${donor.name} ,Please complete your profile!`
        })
    }
    return res.status(200).json({
        success: true,
        donorName: donor.name,
        verified: donor.approved,
        photoUrl: donor.photoUrl
    })
}
export const profileSetup = async (req, res) => {
    try {
        const { dob, shopName, shopAddress,
            refrigerator, refrigeratorNumber, refrigeratorTemperature,
            freezer, freezerNumber, freezerTemperature,
            kitchen
        } = req.body
        const userPublicId = req.user.id
        const [user] = await db.select().from(users).where(eq(users.publicId, userPublicId))
        const userId = user.id
        const coordinates = await geocodeAddress(shopAddress);

        if (!coordinates) {
            return res.status(422).json({
                success: false,
                message: "Could not locate this shop address. Please provide a more complete address.",
            });
        }
        console.log(coordinates)
        const aadharUrl = await uploadToCloudinary(
            req.files.aadhar[0],
            "donor/aadhar"
        );

        const shopLicenseUrl = await uploadToCloudinary(
            req.files.shopLicense[0],
            "donor/shopLicense"
        );

        const photoUrl = await uploadToCloudinary(
            req.files.photo[0],
            "donor/photo"
        );

        const [donor] = await db
            .update(donors)
            .set({
                profileComplete: true,
                photoUrl,
                dob,
                shopName,
                shopAddress,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
            })
            .where(eq(donors.userId, userId)).returning();
        const toNullableNumber = (value) => {
            if (
                value === undefined ||
                value === null ||
                String(value).trim() === ""
            ) {
                return null;
            }

            const number = Number(value);

            if (!Number.isFinite(number)) {
                return null;
            }

            return number;
        };

        const refrigeratorTemp = toNullableNumber(refrigeratorTemperature);
        const freezerTemp = toNullableNumber(freezerTemperature);
        const refrigeratorCount = toNullableNumber(refrigeratorNumber);
        const freezerCount = toNullableNumber(freezerNumber);
        await db
            .insert(donorFacilities)
            .values({
                donorId: donor.id,

                refrigerator: refrigerator === "true",
                refrigeratorNumber: refrigeratorCount,
                refrigeratorTemperature: refrigeratorTemp,

                freezer: freezer === "true",
                freezerNumber: freezerCount,
                freezerTemperature: freezerTemp,

                kitchen: kitchen === "true",
            })
            .onConflictDoUpdate({
                target: donorFacilities.donorId,
                set: {
                    refrigerator: refrigerator === "true",
                    refrigeratorNumber: refrigeratorCount,
                    refrigeratorTemperature: refrigeratorTemp,

                    freezer: freezer === "true",
                    freezerNumber: freezerCount,
                    freezerTemperature: freezerTemp,

                    kitchen: kitchen === "true",
                },
            });

        await db
            .insert(donorDocuments)
            .values({
                donorId: donor.id,
                aadharUrl,
                shopLicenseUrl,
            })
            .onConflictDoUpdate({
                target: donorDocuments.donorId,
                set: {
                    aadharUrl,
                    shopLicenseUrl,
                },
            });
        return res.status(200).json({
            success: true,
            message: `${donor.name}, your profile is setup. Now you can contribute in our program !!`
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

export const classifyFoodController = async (req, res) => {
    try {
        const { foodName, ingredients } = req.body;

        if (
            typeof foodName !== "string" ||
            !foodName.trim() ||
            !Array.isArray(ingredients) ||
            ingredients.length === 0 ||
            !ingredients.every(
                (item) => typeof item === "string" && item.trim()
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Provide a food name and a list of ingredients.",
            });
        }

        const result = await classifyFood(foodName, ingredients);

        return res.status(200).json({
            success: true,
            foodName: result.food_name,
            predictions: result.predictions,
            threshold: result.threshold,
        });
    } catch (error) {
        console.error("Food classification failed:", error.message);

        return res.status(502).json({
            success: false,
            message: "Unable to classify food right now.",
        });
    }
};


export const checkExpiryTime = async (
    predictedCategories,
    storageHistory,
    dateTime
) => {
    const preparedAt = new Date(dateTime);
    const now = new Date();

    if (
        Number.isNaN(preparedAt.getTime()) ||
        preparedAt > now
    ) {
        throw new Error("Invalid preparation date or time.");
    }

    const elapsedMinutes = Math.floor(
        (now.getTime() - preparedAt.getTime()) / 60000
    );

    const categoryNames = predictedCategories.map(
        (prediction) => prediction.category
    );

    const categories = await db
        .select()
        .from(foodCategory)
        .where(inArray(foodCategory.c_name, categoryNames));

    // Do not silently ignore an AI category missing from the database
    const foundNames = new Set(
        categories.map((category) => category.c_name)
    );

    const missingCategories = categoryNames.filter(
        (name) => !foundNames.has(name)
    );

    if (missingCategories.length > 0) {
        throw new Error(
            `Missing food categories: ${missingCategories.join(", ")}`
        );
    }

    const categoryIds = categories.map(
        (category) => category.c_id
    );

    const rules = categoryIds.length
        ? await db
            .select()
            .from(foodRule)
            .where(inArray(foodRule.c_id, categoryIds))
        : [];

    const applicableRules = rules.filter(
        (rule) => rule.storage_condition === storageHistory
    );

    // Require a rule for every predicted category
    const categoriesWithoutRules = categories.filter(
        (category) =>
            !applicableRules.some(
                (rule) => rule.c_id === category.c_id
            )
    );

    if (categoriesWithoutRules.length > 0) {
        throw new Error(
            `Missing applicable rules for: ${categoriesWithoutRules
                .map((category) => category.c_name)
                .join(", ")
            }`
        );
    }

    if (applicableRules.length === 0) {
        throw new Error("No applicable food safety rules found.");
    }

    // Use the most restrictive applicable time limit
    const restrictiveRule = applicableRules.reduce(
        (shortest, rule) =>
            rule.max_time < shortest.max_time ? rule : shortest
    );

    const restrictiveCategory = categories.find(
        (category) => category.c_id === restrictiveRule.c_id
    );

    const maxTimeMinutes = restrictiveRule.max_time;
    const remainingMinutes = maxTimeMinutes - elapsedMinutes;

    const expectedExpiryTime = new Date(
        preparedAt.getTime() + maxTimeMinutes * 60000
    );

    return {
        category: restrictiveCategory?.c_name,
        elapsedMinutes,
        maxTimeMinutes,
        remainingMinutes,
        expectedExpiryTime,
        timeEligible: remainingMinutes > 0
    };
};


export const createDonation = async (req, res) => {
    try {
        const {
            foodName,
            foodType,
            quantity,
            storageHistory,
            ingredients,
            dateTime,
        } = req.body;

        // 1. Validate incoming data
        if (
            typeof foodName !== "string" ||
            !foodName.trim() ||
            !["veg", "non_veg"].includes(foodType) ||
            quantity == null ||
            !String(quantity).trim() ||
            !["room_temp", "refrigerator", "freezer"].includes(storageHistory) ||
            !Array.isArray(ingredients) ||
            ingredients.length === 0 ||
            !ingredients.every(
                (item) => typeof item === "string" && item.trim()
            ) ||
            typeof dateTime !== "string" ||
            Number.isNaN(Date.parse(dateTime)) ||
            new Date(dateTime) > new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid food details and preparation time.",
            });
        }

        // 2. Find the logged-in user
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.publicId, req.user.id));

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // 3. Find the donor
        const [donor] = await db
            .select()
            .from(donors)
            .where(eq(donors.userId, user.id));

        if (!donor) {
            return res.status(404).json({
                success: false,
                message: "Donor profile not found.",
            });
        }

        // Check whether the donor has completed their profile
        if (!donor.profileComplete) {
            return res.status(403).json({
                success: false,
                message: "Please complete your donor profile first.",
            });
        }

        // Check whether the donor has been approved
        if (donor.verifyStatus !== "approved") {
            return res.status(403).json({
                success: false,
                message: "Your donor account is awaiting verification.",
            });
        }

        // 4. Classify the food
        const aiResult = await classifyFood(foodName.trim(), ingredients);
        const predictedCategories = aiResult.predictions;

        if (!predictedCategories?.length) {
            return res.status(422).json({
                success: false,
                message: "Food could not be confidently classified.",
            });
        }

        // 5. Check configured time limits
        let expiryResult;

        try {
            expiryResult = await checkExpiryTime(
                predictedCategories,
                storageHistory,
                dateTime
            );
        } catch (error) {
            console.error("Expiry rule check failed:", error);

            return res.status(422).json({
                success: false,
                message:
                    "Could not verify this food against the configured food rules.",
            });
        }

        if (!expiryResult.timeEligible) {
            return res.status(422).json({
                success: false,
                status: "expired",
                message: "The configured time limit has elapsed.",
                expiry: expiryResult,
            });
        }

        // 6. Check cached donor coordinates
        const donorHasCoordinates =
            donor.latitude != null &&
            donor.longitude != null &&
            Number.isFinite(Number(donor.latitude)) &&
            Number.isFinite(Number(donor.longitude)) &&
            Math.abs(Number(donor.latitude)) <= 90 &&
            Math.abs(Number(donor.longitude)) <= 180;

        const locatedNgos = [];

        // 7. Find approved NGOs within 10 km
        if (donorHasCoordinates) {
            const verifiedNgos = await db
                .select({
                    id: ngos.id,
                    organizationName: ngos.organizationName,
                    latitude: ngos.latitude,
                    longitude: ngos.longitude,
                })
                .from(ngos)
                .where(eq(ngos.verifyStatus, "approved"));

            for (const ngo of verifiedNgos) {
                if (
                    ngo.latitude == null ||
                    ngo.longitude == null ||
                    !Number.isFinite(Number(ngo.latitude)) ||
                    !Number.isFinite(Number(ngo.longitude)) ||
                    Math.abs(Number(ngo.latitude)) > 90 ||
                    Math.abs(Number(ngo.longitude)) > 180
                ) {
                    continue;
                }

                const distanceKm = distanceInKm(
                    Number(donor.latitude),
                    Number(donor.longitude),
                    Number(ngo.latitude),
                    Number(ngo.longitude)
                );

                if (Number.isFinite(distanceKm) && distanceKm <= 10) {
                    locatedNgos.push({
                        id: ngo.id,
                        organizationName: ngo.organizationName,
                        distanceKm: Number(distanceKm.toFixed(2)),
                    });
                }
            }
        }

        // 8. Save donation and NGO requests atomically
        const newDonation = await db.transaction(async (tx) => {
            const [donation] = await tx
                .insert(donations)
                .values({
                    donor_id: donor.id,
                    foodName: foodName.trim(),
                    foodType,
                    quantity: String(quantity),
                    storageHistory,
                    ingredients: JSON.stringify(ingredients),
                    dateTime: new Date(dateTime).toISOString(),
                    elapsedMinutes: expiryResult.elapsedMinutes,
                    maxTimeMinutes: expiryResult.maxTimeMinutes,
                    remainingMinutes: expiryResult.remainingMinutes,
                    expectedExpiryTime: new Date(
                        expiryResult.expectedExpiryTime
                    ),
                    donationStatus: "pending",
                })
                .returning();

            if (locatedNgos.length > 0) {
                await tx.insert(donationRequests).values(
                    locatedNgos.map((ngo) => ({
                        donationId: donation.donation_id,
                        ngoId: ngo.id,
                    }))
                );
            }

            return donation;
        });

        // 9. Respond to the frontend
        return res.status(201).json({
            success: true,
            message: !donorHasCoordinates
                ? "Donation created, but NGO matching was skipped because the donor location is missing."
                : locatedNgos.length > 0
                    ? "Donation created and requests sent to nearby verified NGOs."
                    : "Donation created, but no verified NGOs with valid coordinates were found within 10 km.",
            donationId: newDonation.donation_id,
            requestsSent: locatedNgos.length,
            nearbyNgos: locatedNgos,
            expiry: expiryResult,
        });
    } catch (error) {
        console.error("Create donation failed:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create donation due to a server error.",
        });
    }
};

export const getDonorDonationHistory = async (req, res) => {
  try {
    // req.user.id is the authenticated user's public UUID.
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.publicId, req.user.id))
      .limit(1);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    const [donor] = await db
      .select({ id: donors.id })
      .from(donors)
      .where(eq(donors.userId, user.id))
      .limit(1);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor profile not found.",
      });
    }

    const rows = await db
      .select({
        donationId: donations.donation_id,
        foodName: donations.foodName,
        foodType: donations.foodType,
        quantity: donations.quantity,
        ingredients: donations.ingredients,
        dateTime: donations.dateTime,
        expectedExpiryTime: donations.expectedExpiryTime,
        donationStatus: donations.donationStatus,

        requestId: donationRequests.id,
        requestStatus: donationRequests.status,

        deliveryId: deliveries.id,
        deliveryStatus: deliveries.status,
        pickupQrToken: deliveries.pickupQrToken,
        pickupScannedAt: deliveries.pickupScannedAt,
        handoverScannedAt: deliveries.handoverScannedAt,
        deliveredAt: deliveries.deliveredAt,
      })
      .from(donations)
      .leftJoin(
        donationRequests,
        and(
          eq(donationRequests.donationId, donations.donation_id),
          eq(donationRequests.status, "accepted")
        )
      )
      .leftJoin(
        deliveries,
        eq(deliveries.requestId, donationRequests.id)
      )
      .where(eq(donations.donor_id, donor.id));

    const history = rows.map((row) => ({
      donationId: row.donationId,
      foodName: row.foodName,
      foodType: row.foodType,
      quantity: row.quantity,
      ingredients: row.ingredients,
      dateTime: row.dateTime,
      expectedExpiryTime: row.expectedExpiryTime,
      donationStatus: row.donationStatus,

      requestStatus: row.requestStatus,
      delivery: row.deliveryId
        ? {
            id: row.deliveryId,
            status: row.deliveryStatus,
            // Only the donor's pickup QR is returned.
            pickupQrToken: row.deliveryStatus !== "cancelled"
              ? row.pickupQrToken
              : null,
            pickupScannedAt: row.pickupScannedAt,
            handoverScannedAt: row.handoverScannedAt,
            deliveredAt: row.deliveredAt,
          }
        : null,
    }));

    return res.status(200).json({
      success: true,
      donations: history,
    });
  } catch (error) {
    console.error("Fetching donor donation history failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch donation history.",
    });
  }
};
