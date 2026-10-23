import { pgTable, serial, integer, text, boolean, timestamp, doublePrecision, index, uniqueIndex, } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { donations } from "./donationSchema";
export const iotBoxes = pgTable(
    "iot_boxes",
    {
        id: serial("id").primaryKey(),

        // Human-readable, unique identifier printed on the box.
        boxCode: text("box_code").notNull().unique(),

        // Store a hash of the device credential, never the raw secret.
        deviceSecretHash: text("device_secret_hash").notNull().unique(),

        // The donation currently assigned to this box, if any.
        donationId: integer("donation_id").references(
            () => donations.donation_id,
            { onDelete: "set null" }
        ),

        isActive: boolean("is_active").default(true).notNull(),

        // Updated when an authenticated heartbeat or reading arrives.
        lastSeenAt: timestamp("last_seen_at", {
            withTimezone: true,
        }),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        }).defaultNow().notNull(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
        }).defaultNow().notNull(),
    },
    (table) => [
        index("iot_boxes_donation_id_idx").on(table.donationId),
        index("iot_boxes_last_seen_at_idx").on(table.lastSeenAt),
    ]
);

// Many readings belong to one physical box.
export const iotReadings = pgTable(
    "iot_readings",
    {
        id: serial("id").primaryKey(),

        boxId: integer("box_id")
            .references(() => iotBoxes.id, { onDelete: "cascade" })
            .notNull(),

        donationId: integer("donation_id").references(
            () => donations.donation_id,
            { onDelete: "set null" }
        ),
        temperature: doublePrecision("temperature"),
        humidity: doublePrecision("humidity"),
        foodTemperature: doublePrecision("food_temperature"),
        doorOpen: boolean("door_open"),
        doorOpenCount: integer("door_open_count"),
        batteryPercent: integer("battery_percent"),

        // When the device measured the values.
        recordedAt: timestamp("recorded_at", {
            withTimezone: true,
        }).notNull(),

        // When the backend received the reading.
        receivedAt: timestamp("received_at", {
            withTimezone: true,
        }).defaultNow().notNull(),
    },
    (table) => [
        index("iot_readings_box_recorded_idx").on(
            table.boxId,
            table.recordedAt
        ),
    ]
);

// Alerts persist independently from individual sensor readings.
export const iotAlerts = pgTable(
    "iot_alerts",
    {
        id: serial("id").primaryKey(),

        boxId: integer("box_id")
            .references(() => iotBoxes.id, { onDelete: "cascade" })
            .notNull(),

        readingId: integer("reading_id").references(
            () => iotReadings.id,
            { onDelete: "set null" }
        ),

        // Examples: high_temperature, sensor_error, device_offline.
        alertType: text("alert_type").notNull(),

        // Examples: low, medium, high, critical.
        severity: text("severity").notNull(),

        message: text("message").notNull(),

        // active, acknowledged, resolved.
        status: text("status").default("active").notNull(),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        }).defaultNow().notNull(),

        acknowledgedAt: timestamp("acknowledged_at", {
            withTimezone: true,
        }),

        resolvedAt: timestamp("resolved_at", {
            withTimezone: true,
        }),
    },
    (table) => [
        index("iot_alerts_box_status_idx").on(
            table.boxId,
            table.status
        ),
        index("iot_alerts_created_at_idx").on(table.createdAt),
    ]
);


export const iotBoxAssignments = pgTable(
    "iot_box_assignments",
    {
        id: serial("id").primaryKey(),

        boxId: integer("box_id")
            .references(() => iotBoxes.id)
            .notNull(),

        donationId: integer("donation_id")
            .references(() => donations.donation_id)
            .notNull(),

        assignedAt: timestamp("assigned_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        returnedAt: timestamp("returned_at", {
            withTimezone: true,
        }),
    },
    (table) => [
        index("iot_box_assignments_donation_idx").on(
            table.donationId
        ),

        // A box can have only one active assignment.
        uniqueIndex("iot_box_one_active_assignment_idx")
            .on(table.boxId)
            .where(sql`${table.returnedAt} IS NULL`),
            
        uniqueIndex("iot_donation_one_active_box_idx")
            .on(table.donationId)
            .where(sql`${table.returnedAt} IS NULL`)
    ]
);
