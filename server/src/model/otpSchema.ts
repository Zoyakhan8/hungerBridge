import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const otps=pgTable("otps",{
    id:serial("id").primaryKey(),
    email:text("email").notNull(),
    otp:text("otp").notNull(),
    expiresAt:timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow()
})