import {
    pgTable,
    serial,
    integer,
    text,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";
import { deliveryPartners } from "./deliveryPartnerSchema";
import { donationRequests } from "./donationRequestSchema";

export const deliveryStatus = pgEnum("delivery_status", [
    "pending",
    "assigned",
    "in_transit",
    "delivered",
    "cancelled",
]);

export const deliveries = pgTable("deliveries", {
    id: serial("id").primaryKey(),

    requestId: integer("request_id")
        .references(() => donationRequests.id, {
            onDelete: "cascade",
        })
        .notNull()
        .unique(),

    deliveryPartnerId: integer("delivery_partner_id")
        .references(() => deliveryPartners.id, {
            onDelete: "set null",
        }),

    status: deliveryStatus("status")
        .default("pending")
        .notNull(),

    pickupQrToken: text("pickup_qr_token").unique(),
    handoverQrToken: text("handover_qr_token").unique(),

    pickupScannedAt: timestamp("pickup_scanned_at", {
        withTimezone: true,
    }),

    handoverScannedAt: timestamp("handover_scanned_at", {
        withTimezone: true,
    }),

    assignedAt: timestamp("assigned_at", {
        withTimezone: true,
    }),

    deliveredAt: timestamp("delivered_at", {
        withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
        withTimezone: true,
    })
        .defaultNow()
        .notNull(),
});
