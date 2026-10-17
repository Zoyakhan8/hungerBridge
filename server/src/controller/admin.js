import { db } from "../config/dbClient";
import { donorDocuments } from "../model/donorDocumentSchema";
import { donors } from "../model/donorRegisterSchema";
import { ngos } from "../model/ngoRegisterSchema";
import { eq, and } from "drizzle-orm";
import { users } from "../model/userSchema";
import { deliveryPartners } from "../model/deliveryPartnerSchema";
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
        console.log(publicId, status)
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
        console.log(publicId, status)
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
    console.log(ngoList,"shsh")
    return res.json({
        ngos: ngoList,
        total: totalNgos.length,
        page,
        limit,
        totalPages: Math.ceil(totalNgos.length / limit),
    })
}

// const getAdminUser = async (publicId) => {
//   const [user] = await db
//     .select({
//       id: users.id,
//       role: users.role,
//     })
//     .from(users)
//     .where(eq(users.publicId, publicId))
//     .limit(1);

//   return user;
// };

// GET pending delivery partner applications
export const getPendingDeliveryPartners = async (req, res) => {
  try {
    // const admin = await getAdminUser(req.user.id);

    // if (!admin || admin.role !== "admin") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Admin access required.",
    //   });
    // }

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

// POST verify a delivery partner
export const verifyDeliveryPartner = async (req, res) => {
  try {
    // const admin = await getAdminUser(req.user.id);

    // if (!admin || admin.role !== "admin") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Admin access required.",
    //   });
    // }

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
