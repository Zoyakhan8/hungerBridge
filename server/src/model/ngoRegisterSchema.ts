import { boolean, doublePrecision, integer, pgEnum, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
export const statusEnum = pgEnum("status", [
    "pending",
    "approved",
    "rejected",
]);
export const ngos = pgTable("ngos", {
    id: serial("id").primaryKey(),
    publicId: uuid("public_id").defaultRandom().notNull(),
    organizationName: text("organization_name").notNull(),
    registeredNumber: text("registered_number").notNull(),
    registeredAddress: text("registered_address").notNull(),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    email: text("email").notNull().unique(),
    phoneNumber: text("phone_number").notNull(),
    registrationCertificateUrl: text("registration_certificate_url"),
    panCardUrl: text("pan_card_url"),
    addressProofUrl: text("address_proof_url"),
    verifyStatus: statusEnum("verify_status").default("pending").notNull(),
    userId: integer("user_id").references(() => users.id,
        { onDelete: "cascade", }).notNull(),
    createdAt: timestamp("created_at").defaultNow()
});