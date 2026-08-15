import { boolean, pgEnum, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";
export const roleEnum = pgEnum("role", [
  "donor",
  "ngo",
  "admin",
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