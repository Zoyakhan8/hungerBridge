
import { z } from "zod";
const complaintCategories = [
    "General Inquiry",
    "Complaint",
    "Technical Issue",
    "Donation Issue",
    "Delivery Issue",
    "NGO Issue",
    "Feedback",
];

export const ComplaintSchema = z.object({
    name: z.string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),

    email: z.string()
        .trim()
        .email("Enter a valid email address")
        .max(255, "Email is too long"),

    phoneNumber: z.union([
        z.literal(""),
        z.string().trim().regex(
            /^[0-9]{10}$/,
            "Enter a valid 10-digit phone number"
        ),
    ]).optional(),

    category: z.enum(complaintCategories),

    subject: z.string()
        .trim()
        .min(3, "Subject must contain at least 3 characters")
        .max(150, "Subject cannot exceed 150 characters"),

    message: z.string()
        .trim()
        .min(10, "Message must contain at least 10 characters")
        .max(5000, "Message cannot exceed 5000 characters"),
});

export const UpdateComplaintStatusSchema = z.object({
    status: z.enum([
        "pending",
        "in_progress",
        "resolved",
        "rejected",
    ]),

    adminNotes: z.string()
        .trim()
        .max(3000, "Admin notes cannot exceed 3000 characters")
        .optional()
        .nullable(),
});
