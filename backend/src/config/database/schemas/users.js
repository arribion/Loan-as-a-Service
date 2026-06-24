import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  timestamp,
  index,
  boolean 
} from "drizzle-orm/pg-core";
// referencies
import tenants from "./tenants.js";

export const securityRoleEnum = pgEnum("security_role", [
  "admin",
  "loan_officer",
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
    tenant_id: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    // account_status: boolean("account_status").default(false),
    full_name: varchar("full_name", { length: 150 }).notNull(),
    email_address: varchar("email_address", { length: 254 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 255 }).notNull(),
    security_role: securityRoleEnum("security_role").notNull().default("borrower"),
    tracking_status: trackingStatusEnum("tracking_status").notNull().default("active"),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_users_tenant").on(table.tenant_id),
    index("idx_users_email").on(table.email_address),
  ],
);

export default users;