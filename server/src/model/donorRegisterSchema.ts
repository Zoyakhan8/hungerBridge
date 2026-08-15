import { boolean, integer, pgTable, serial, text, timestamp, uuid, } from "drizzle-orm/pg-core";
import { users } from "./userSchema";
export const donors = pgTable("donors", {
  id: serial("id").primaryKey(),
  publicId: uuid("public_id").defaultRandom().unique().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number").notNull(),
  companyName: text("company_name"),
  approved: boolean("approved").default(false).notNull(),
  userId: integer("user_id").references(() => users.id,
    { onDelete: "cascade", }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});