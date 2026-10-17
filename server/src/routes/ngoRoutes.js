import { Router } from "express"
import { isNgo, verifyToken } from "../middleware/auth";
import { getMyDeliveries, getRequest, updateRequestStatus } from "../controller/ngo";

export const ngoRoutes = Router();
ngoRoutes.get(
    "/request",
    verifyToken,
    isNgo,
    getRequest
);
ngoRoutes.patch(
  "/request/:id/status",
  verifyToken,
  isNgo,
  updateRequestStatus
);
ngoRoutes.get(
    "/donation",
    verifyToken,
    isNgo,
    getMyDeliveries
)