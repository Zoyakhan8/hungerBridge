import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"
import { users } from "./userSchema"
export const verificationToken = pgTable("verification_token", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id,
        { onDelete: "cascade", }).notNull(),
    verificationToken: text("verification_token").notNull().unique(),
    used: boolean("used").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at").notNull()
})