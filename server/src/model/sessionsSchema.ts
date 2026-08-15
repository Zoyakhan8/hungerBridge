import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./userSchema";

export const sessions=pgTable("session",{
    id: serial("id").primaryKey(),
    userId:integer("user_id")
    .references(()=>users.id,{onDelete:"cascade"}).notNull(),
    refreshToken:text("refresh_token").notNull(),
    ipAddress:text("ip_address").notNull(),
    expiresAt:timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})