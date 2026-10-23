import { db } from "../config/dbClient";
import { donorDocuments } from "../model/donorDocumentSchema";
import { donors } from "../model/donorRegisterSchema";
import { ngos } from "../model/ngoRegisterSchema";
import {and,count,desc,eq,gte,inArray,lt,} from "drizzle-orm";
import { users } from "../model/userSchema";
import { deliveryPartners } from "../model/deliveryPartnerSchema";
import { donations } from "../model/donationSchema";
import { complaints } from "../model/userSchema";
export const getDonorManagement = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const totalDonors = await db
        .select()
        .from(donors);

    const donorList = await db
        .select({
            publicId: donors.publicId,
            name: donors.name,
            phoneNumber: donors.phoneNumber,
            shopName: donors.shopName,
            shopAddress: donors.shopAddress,
            verifyStatus: donors.verifyStatus,
            photoUrl: donors.photoUrl,
            aadharUrl: donorDocuments.aadharUrl,
            shopLicenseUrl: donorDocuments.shopLicenseUrl
        })
        .from(donors)
        .leftJoin(
            donorDocuments,
            eq(donors.id, donorDocuments.donorId)
        )
        .limit(limit)
        .offset(skip);
    return res.json({
        donors: donorList,
        total: totalDonors.length,
        page,
        limit,
        totalPages: Math.ceil(totalDonors.length / limit),
    })
}
export const verifyDonor = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body;
        const publicId = id
        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification status"
            });
        }
        const [donor] = await db.select()
            .from(donors)
            .where(eq(donors.publicId, publicId))
        if (!donor) {
            return res.status(404).json({
                success: false,
                message: "Donor not found"
            })
        }
        await db.update(donors)
            .set({ verifyStatus: status })
            .where(eq(donors.publicId, publicId))
        return res.status(200).json({
            success: true,
            message: `Donor ${status} successfully!`
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: `Server Error `
        })
    }
}
export const verifyNgo = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body;
        const publicId = id
        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification status"
            });
        }
        const [ngo] = await db.select()
            .from(ngos)
            .where(eq(ngos.publicId, publicId))
        if (!ngo) {
            return res.status(404).json({
                success: false,
                message: "Donor not found"
            })
        }
        await db.update(ngos)
            .set({ verifyStatus: status })
            .where(eq(ngos.publicId, publicId))
        return res.status(200).json({
            success: true,
            message: `Donor ${status} successfully!`
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: `Server Error `
        })
    }
}
export const getNgoManagement = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const totalNgos = await db
        .select()
        .from(ngos);

    const ngoList = await db
        .select({
            publicId: ngos.publicId,
            name: ngos.organizationName,
            phoneNumber: ngos.phoneNumber,
            registeredNumber: ngos.registeredNumber,
            registeredAddress: ngos.registeredAddress,
            verifyStatus: ngos.verifyStatus,
            panCardUrl: ngos.panCardUrl,
            addressProofUrl:ngos.addressProofUrl,
            registrationCertificateUrl: ngos.registrationCertificateUrl
        })
        .from(ngos)
        .limit(limit)
        .offset(skip);
    return res.json({
        ngos: ngoList,
        total: totalNgos.length,
        page,
        limit,
        totalPages: Math.ceil(totalNgos.length / limit),
    })
}
export const getPendingDeliveryPartners = async (req, res) => {
  try {

    const partners = await db
      .select({
        id: deliveryPartners.id,
        fullName: deliveryPartners.fullName,
        vehicleType: deliveryPartners.vehicleType,
        vehicleNumber: deliveryPartners.vehicleNumber,
        isVerified: deliveryPartners.isVerified,
        isAvailable: deliveryPartners.isAvailable,
        createdAt: deliveryPartners.createdAt,
        email: users.email,
        phoneNumber: users.phoneNumber,
      })
      .from(deliveryPartners)
      .innerJoin(
        users,
        eq(deliveryPartners.userId, users.id)
      )
      .where(eq(deliveryPartners.isVerified, false));

    return res.status(200).json({
      success: true,
      partners,
    });
  } catch (error) {
    console.error("Fetching pending partners failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending partners.",
    });
  }
};
export const verifyDeliveryPartner = async (req, res) => {
  try {
    const partnerId = Number(req.params.id);

    if (!Number.isInteger(partnerId) || partnerId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery partner ID.",
      });
    }

    const [partner] = await db
      .update(deliveryPartners)
      .set({
        isVerified: true,
      })
      .where(
        and(
          eq(deliveryPartners.id, partnerId),
          eq(deliveryPartners.isVerified, false)
        )
      )
      .returning({
        id: deliveryPartners.id,
        fullName: deliveryPartners.fullName,
        isVerified: deliveryPartners.isVerified,
      });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message:
          "Pending partner not found or already verified.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery partner verified successfully.",
      partner,
    });
  } catch (error) {
    console.error("Verifying delivery partner failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify delivery partner.",
    });
  }
};
export const getDashboard = async (req, res) => {
    try {
        const period = String(req.query.period || "month");

        const allowedPeriods = [
            "today",
            "week",
            "month",
            "year",
            "all",
        ];

        if (!allowedPeriods.includes(period)) {
            return res.status(400).json({
                success: false,
                message: "Invalid dashboard period.",
            });
        }

        // Calculate the beginning of the selected reporting period.
        const now = new Date();
        const start = new Date(now);

        switch (period) {
            case "today":
                start.setHours(0, 0, 0, 0);
                break;

            case "week": {
                start.setHours(0, 0, 0, 0);
                const day = start.getDay();
                const daysSinceMonday = (day + 6) % 7;
                start.setDate(start.getDate() - daysSinceMonday);
                break;
            }

            case "month":
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                break;

            case "year":
                start.setMonth(0, 1);
                start.setHours(0, 0, 0, 0);
                break;
        }

        const donationPeriodCondition =
            period === "all"
                ? undefined
                : and(
                    gte(donations.createdAt, start),
                    lt(donations.createdAt, now)
                );

        const complaintPeriodCondition =
            period === "all"
                ? undefined
                : and(
                    gte(complaints.createdAt, start),
                    lt(complaints.createdAt, now)
                );

        // All-time registrations and current verification status.
        const [
            [totalNgos],
            [approvedDonors],
            [totalDonors],
            [pendingDonorsCount],
            [pendingNgosCount],
            [pendingPartnersCount],
            [deliveredCount],
            [openComplaintsCount],
        ] = await Promise.all([
            db.select({ value: count() }).from(ngos),

            db.select({ value: count() })
                .from(donors)
                .where(eq(donors.verifyStatus, "approved")),

            db.select({ value: count() }).from(donors),

            db.select({ value: count() })
                .from(donors)
                .where(eq(donors.verifyStatus, "pending")),

            db.select({ value: count() })
                .from(ngos)
                .where(eq(ngos.verifyStatus, "pending")),

            db.select({ value: count() })
                .from(deliveryPartners)
                .where(eq(deliveryPartners.isVerified, false)),

            db.select({ value: count() })
                .from(donations)
                .where(
                    donationPeriodCondition
                        ? and(
                            eq(donations.donationStatus, "delivered"),
                            donationPeriodCondition
                        )
                        : eq(donations.donationStatus, "delivered")
                ),

            db.select({ value: count() })
                .from(complaints)
                .where(
                    inArray(complaints.status, [
                        "pending",
                        "in_progress",
                    ])
                ),
        ]);

        // Fetch actual records for the pending-task panel.
        const [
            pendingDonors,
            pendingNgos,
            pendingPartners,
            openComplaintTasks,
        ] = await Promise.all([
            db.select({
                id: donors.publicId,
                name: donors.name,
            })
                .from(donors)
                .where(eq(donors.verifyStatus, "pending"))
                .limit(10),

            db.select({
                id: ngos.publicId,
                name: ngos.organizationName,
            })
                .from(ngos)
                .where(eq(ngos.verifyStatus, "pending"))
                .limit(10),

            db.select({
                id: deliveryPartners.id,
                name: deliveryPartners.fullName,
                createdAt: deliveryPartners.createdAt,
            })
                .from(deliveryPartners)
                .where(eq(deliveryPartners.isVerified, false))
                .orderBy(desc(deliveryPartners.createdAt))
                .limit(10),

            db.select({
                id: complaints.publicId,
                subject: complaints.subject,
                category: complaints.category,
                status: complaints.status,
                createdAt: complaints.createdAt,
            })
                .from(complaints)
                .where(
                    inArray(complaints.status, [
                        "pending",
                        "in_progress",
                    ])
                )
                .orderBy(desc(complaints.createdAt))
                .limit(10),
        ]);

        const tasks = [
            ...pendingDonors.map((donor) => ({
                id: `donor-${donor.id}`,
                entityId: donor.id,
                type: "DONOR VERIFICATION",
                title: `Verify ${donor.name || "donor"}`,
                description:
                    "Review the donor's verification documents.",
                priority: "medium",
                status: "pending",
                href: "/admin/donor-management",
            })),

            ...pendingNgos.map((ngo) => ({
                id: `ngo-${ngo.id}`,
                entityId: ngo.id,
                type: "NGO VERIFICATION",
                title: `Verify ${ngo.name || "NGO"}`,
                description:
                    "Review the NGO's registration documents.",
                priority: "medium",
                status: "pending",
                href: "/admin/ngo-management",
            })),

            ...pendingPartners.map((partner) => ({
                id: `partner-${partner.id}`,
                entityId: partner.id,
                type: "DELIVERY PARTNER",
                title: `Verify ${partner.name || "delivery partner"}`,
                description:
                    "Review the delivery partner's details.",
                priority: "medium",
                status: "pending",
                createdAt: partner.createdAt,
                href: "/admin/delivery-partners",
            })),

            ...openComplaintTasks.map((complaint) => ({
                id: `complaint-${complaint.id}`,
                entityId: complaint.id,
                type: "COMPLAINT",
                title: complaint.subject,
                description:
                    `${complaint.category} · ${complaint.status.replace("_", " ")}`,
                priority: complaint.status === "pending"
                    ? "high"
                    : "medium",
                status: complaint.status,
                createdAt: complaint.createdAt,
                href: "/admin/complaints",
            })),
        ];

        tasks.sort((a, b) => {
            const aTime = a.createdAt
                ? new Date(a.createdAt).getTime()
                : 0;

            const bTime = b.createdAt
                ? new Date(b.createdAt).getTime()
                : 0;

            return bTime - aTime;
        });

        const alerts = openComplaintTasks.map((complaint) => ({
            id: complaint.id,
            type: "COMPLAINT",
            title: complaint.subject,
            location: complaint.category,
            priority: complaint.status === "pending"
                ? "high"
                : "medium",
        }));

        return res.status(200).json({
            success: true,

            stats: {
                totalNgos: totalNgos.value,
                activeDonors: approvedDonors.value,

                // This is the count of delivered donation records,
                // not a sum of meals, because quantity is stored as text.
                mealsDistributed: deliveredCount.value,

                openComplaints: openComplaintsCount.value,

                totalDonors: totalDonors.value,
                pendingDonorVerifications: pendingDonorsCount.value,
                pendingNgoVerifications: pendingNgosCount.value,
                pendingDeliveryPartnerVerifications:
                    pendingPartnersCount.value,

                totalPendingVerifications:
                    pendingDonorsCount.value +
                    pendingNgosCount.value +
                    pendingPartnersCount.value,

                period,
            },

            tasks: tasks.slice(0, 20),
            alerts,
            lastSyncedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Admin dashboard failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to load admin dashboard.",
        });
    }
};
