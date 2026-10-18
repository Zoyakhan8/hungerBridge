import { Router } from "express";
import { isDelivery, verifyToken } from "../middleware/auth";
import { getMyDeliveries, scanDeliveryQR, updatePartnerAvailability } from "../controller/delivery";
import { registerDeliveryPartner } from "../controller/deliveryAuth";
export const deliveryRoutes = Router();
deliveryRoutes.post("/scan", verifyToken, scanDeliveryQR);
deliveryRoutes.post("/register",registerDeliveryPartner)
deliveryRoutes.get(
  "/my-deliveries",
  verifyToken,
  isDelivery,
  getMyDeliveries
);
deliveryRoutes.patch(
  "/availability",
  verifyToken,
  updatePartnerAvailability
);
