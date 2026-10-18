
import { desc, eq } from "drizzle-orm";
import { db } from "../config/dbClient.js";
import { complaints } from "../model/userSchema.js";

// POST: Submit a complaint or contact message
export const createComplaint = async (req, res) => {
    try {
        const {
            name,
            email,
            phoneNumber,
            category,
            subject,
            message,
        } = req.body;

        const [complaint] = await db
            .insert(complaints)
            .values({
                name,
                email,
                phoneNumber: phoneNumber || null,
                category,
                subject,
                message,
            })
            .returning({
                publicId: complaints.publicId,
                status: complaints.status,
                createdAt: complaints.createdAt,
            });

        return res.status(201).json({
            success: true,
            message: "Your message has been submitted successfully.",
            complaint,
        });
    } catch (error) {
        console.error("Create complaint error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to submit your message right now.",
        });
    }
};

// GET: Admin views all complaints
export const getComplaints = async (req, res) => {
    try {
        const results = await db
            .select()
            .from(complaints)
            .orderBy(desc(complaints.createdAt));

        return res.status(200).json({
            success: true,
            complaints: results,
        });
    } catch (error) {
        console.error("Get complaints error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch complaints.",
        });
    }
};

// GET: Admin views one complaint
export const getComplaintById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint ID.",
            });
        }

        const [complaint] = await db
            .select()
            .from(complaints)
            .where(eq(complaints.id, id))
            .limit(1);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found.",
            });
        }

        return res.status(200).json({
            success: true,
            complaint,
        });
    } catch (error) {
        console.error("Get complaint details error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch complaint details.",
        });
    }
};

// PATCH: Admin updates status and notes
export const updateComplaintStatus = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint ID.",
            });
        }

        const { status, adminNotes } = req.body;

        const [updatedComplaint] = await db
            .update(complaints)
            .set({
                status,
                adminNotes: adminNotes ?? null,
                updatedAt: new Date(),
            })
            .where(eq(complaints.id, id))
            .returning();

        if (!updatedComplaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Complaint updated successfully.",
            complaint: updatedComplaint,
        });
    } catch (error) {
        console.error("Update complaint error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update complaint.",
        });
    }
};
