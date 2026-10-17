
import {
  pgEnum,
  pgTable,
  serial,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { donations } from "./donationSchema";
import { ngos } from "./ngoRegisterSchema";

export const donationRequestStatus = pgEnum(
  "donation_request_status",
  ["pending", "accepted", "declined", "cancelled"]
);

export const donationRequests = pgTable(
  "donation_requests",
  {
    id: serial("id").primaryKey(),

    donationId: integer("donation_id")
      .references(() => donations.donation_id, {
        onDelete: "cascade",
      })
      .notNull(),

    ngoId: integer("ngo_id")
      .references(() => ngos.id, {
        onDelete: "cascade",
      })
      .notNull(),

    status: donationRequestStatus("status")
      .default("pending")
      .notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    }).defaultNow().notNull(),

    respondedAt: timestamp("responded_at", {
      withTimezone: true,
    }),
  },
  (table) => [
    unique("donation_request_unique").on(
      table.donationId,
      table.ngoId
    ),
  ]
);
