import { Router } from "express"
import { getDonorManagement, getNgoManagement, getPendingDeliveryPartners, verifyDeliveryPartner, verifyDonor, verifyNgo } from "../controller/admin";
export const adminRoutes = Router();
adminRoutes.get("/donor-management",getDonorManagement)
adminRoutes.get("/delivery-partners/pending",getPendingDeliveryPartners)
adminRoutes.post("/delivery-partners/:id/verify",verifyDeliveryPartner)
adminRoutes.patch("/donors/:id/status",verifyDonor)
adminRoutes.get("/ngo-management",getNgoManagement)
adminRoutes.patch("/ngos/:id/status",verifyNgo)