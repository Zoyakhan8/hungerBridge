import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./userSchema";

export const deliveryPartners = pgTable("delivery_partners", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),

  fullName: text("full_name").notNull(),

  vehicleType: text("vehicle_type"),

  vehicleNumber: text("vehicle_number"),

  isAvailable: boolean("is_available")
    .default(true)
    .notNull(),

  isVerified: boolean("is_verified")
    .default(false)
    .notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
