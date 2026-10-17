import { boolean, doublePrecision, integer, pgEnum, pgTable, serial, text, timestamp, uuid, } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
export const statusEnum = pgEnum("status", [
  "pending",
  "approved",
  "rejected",
]);

export const donors = pgTable("donors", {
  id: serial("id").primaryKey(),
  publicId: uuid("public_id").defaultRandom().unique().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").notNull(),
  companyName: text("company_name"),
  verifyStatus: statusEnum("verify_status").default("pending").notNull(),
  userId: integer("user_id").references(() => users.id,
    { onDelete: "cascade", }).notNull(),
  profileComplete: boolean("profile_complete").default(false),
  photoUrl: text("photo_url"),
  dob: text("dob"),
  shopName: text("shop_name"),
  shopAddress: text("shop_address"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});