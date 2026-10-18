import { boolean, pgEnum, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
export const roleEnum = pgEnum("role", [
  "donor",
  "ngo",
  "admin",
  "delivery_partner"
]);
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    publicId:uuid("public_id").defaultRandom().notNull().unique(),
    email: text("email").notNull().unique(),
    phoneNumber: text("phone_number").notNull(),
    password: text("password").notNull(),
    role:roleEnum().notNull().default("donor"),
    emailVerified: boolean("email_verified").default(false),
    createdAt: timestamp("created_at").defaultNow()
});
export const complaintStatusEnum = pgEnum("complaint_status", [
    "pending",
    "in_progress",
    "resolved",
    "rejected",
]);

export const complaints = pgTable("complaints", {
    id: serial("id").primaryKey(),

    // Public reference for displaying a complaint identifier.
    publicId: uuid("public_id").defaultRandom().notNull().unique(),

    name: text("name").notNull(),
    email: text("email").notNull(),
    phoneNumber: text("phone_number"),

    category: text("category").notNull(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),

    status: complaintStatusEnum("status")
        .notNull()
        .default("pending"),

    adminNotes: text("admin_notes"),

    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull(),
});