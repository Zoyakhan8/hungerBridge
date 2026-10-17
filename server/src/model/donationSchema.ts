import { date, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { donors } from "./donorRegisterSchema";
export const foodType = pgEnum("food_type", [
    "veg",
    "non_veg"
]);
export const storageCondition = pgEnum("storage_history", [
    "room_temp",
    "refrigerator",
    "freezer",
]);
export const donationStatus = pgEnum("donation_status", [
    "pending",
    "accepted",
    "picked_up",
    "in-transit",
    "delivered"
]);
export const donations = pgTable("donations", {
    donation_id: serial("donation_id").primaryKey(),
    donor_id: integer("donor_id").references(() => donors.id,
        { onDelete: "cascade", }).notNull(),
    foodName: text("food_name").notNull(),
    foodType: foodType("food_type").default("veg").notNull(),
    quantity: text("quantity").notNull(),
    storageHistory: storageCondition("storage_history").default("room_temp").notNull(),
    ingredients: text("ingredients").notNull(),
    dateTime:text("prepared_date_time"),
    elapsedMinutes: integer("elapsed_minutes").notNull(),
    maxTimeMinutes: integer("maxTime_minutes").notNull(),
    remainingMinutes: integer("remaining_minutes").notNull(),
    expectedExpiryTime: timestamp("expected_expiry_time", {
        withTimezone: true,
    }).notNull(),
    donationStatus: donationStatus("donation_status").default("pending"),
    createdAt: timestamp("created_At").defaultNow()
})
