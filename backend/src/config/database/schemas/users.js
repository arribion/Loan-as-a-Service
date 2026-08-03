import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants.js";

export const securityRoleEnum = pgEnum("security_role", [
  "admin",
  "loan_officer",
  "auditor",
  "borrower",
]);
export const trackingStatusEnum = pgEnum("tracking_status", [
  "active",
  "suspended",
  "pending_kyc",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    fullName: varchar("full_name", { length: 150 }).notNull(),
    emailAddress: varchar("email_address", { length: 254 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }),
    securityRole: securityRoleEnum("security_role")
      .notNull()
      .default("borrower"),
    trackingStatus: trackingStatusEnum("tracking_status")
      .notNull()
      .default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_users_tenant").on(table.tenantId),
    index("idx_users_email").on(table.emailAddress),
  ],
);