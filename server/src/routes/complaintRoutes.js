
import { Router } from "express";
import { getComplaintById, getComplaints, updateComplaintStatus } from "../controller/complaint.js";

import { verifyToken, isAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { UpdateComplaintStatusSchema } from "../validator/ComplaintSchema.js";

export const complaintRoutes = Router();

complaintRoutes.use(verifyToken, isAdmin);

complaintRoutes.get("/", getComplaints);

complaintRoutes.get("/:id", getComplaintById);

complaintRoutes.patch(
    "/:id/status",
    validate(UpdateComplaintStatusSchema),
    updateComplaintStatus
);
