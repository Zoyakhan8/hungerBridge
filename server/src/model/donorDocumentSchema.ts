import { boolean, integer, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { donors } from "./donorRegisterSchema";
export const donorDocuments = pgTable("donor_documents", {
    id: serial("id").primaryKey(),
    donorId: integer("donor_id").references(() => donors.id,
        { onDelete: "cascade", }).notNull(),
    aadharUrl: text("aadhar_url"),
    shopLicenseUrl: text("shop_license_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})
export const donorFacilities = pgTable("donor_facilities", {
    id: serial("id").primaryKey(),
    donorId: integer("donor_id").references(() => donors.id,
        { onDelete: "cascade", }).notNull(),
    refrigerator:boolean("refrigerator").notNull().default(false),
    refrigertorNumber:integer("total_refrigerator"),
    refrigeratorTemperature:numeric("refrigerator_temperature",{ precision: 5, scale: 2 }),
    freezer:boolean("freezer").notNull().default(false),
    freezerNumber:integer("total_freezer"),
    freezerTemperature:numeric("freezer_temperature",{ precision: 5, scale: 2 }),
    kitchen:boolean("kitchen").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})