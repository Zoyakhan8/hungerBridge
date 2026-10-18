import { Router } from "express"
import { getDashboard, getDonorManagement, getNgoManagement, getPendingDeliveryPartners, verifyDeliveryPartner, verifyDonor, verifyNgo } from "../controller/admin";
import { isAdmin, verifyToken } from "../middleware/auth";
import { getIoTAlerts, getIoTBoxes, getIoTOverview } from "../controller/iotAdmin";
export const adminRoutes = Router();
adminRoutes.get("/", verifyToken, isAdmin, getDashboard)
adminRoutes.get("/donor-management", verifyToken, isAdmin, getDonorManagement)
adminRoutes.get("/delivery-partners/pending", verifyToken, isAdmin, getPendingDeliveryPartners)
adminRoutes.post("/delivery-partners/:id/verify", verifyToken, isAdmin, verifyDeliveryPartner)
adminRoutes.patch("/donors/:id/status", verifyDonor)
adminRoutes.get("/ngo-management", verifyToken, isAdmin, getNgoManagement)
adminRoutes.patch("/ngos/:id/status", verifyNgo)
adminRoutes.get(
    "/monitoring/overview",
    verifyToken,
    isAdmin,
    getIoTOverview
);

adminRoutes.get(
    "/monitoring/boxes",
    verifyToken,
    isAdmin,
    getIoTBoxes
);

adminRoutes.get(
    "/monitoring/alerts",
    verifyToken,
    isAdmin,
    getIoTAlerts
);