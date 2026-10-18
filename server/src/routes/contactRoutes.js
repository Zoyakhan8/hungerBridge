import { Router } from "express";
import { createComplaint } from "../controller/complaint.js";
import { validate } from "../middleware/validate.js";
import { ComplaintSchema } from "../validator/ComplaintSchema.js";
export const contactRoutes = Router();

contactRoutes.post(
    "/",
    validate(ComplaintSchema),
    createComplaint
);
