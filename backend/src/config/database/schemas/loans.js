import {
  pgTable,
  uuid,
  pgEnum,
  numeric,
  integer,
  timestamp,
  index,
  check,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import {tenants} from "./tenants.js";
import {customerProfiles} from "./customer_profiles.js";
import {loanProducts} from "./loan_products.js";

export const loanLifecycleEnum = pgEnum("lifecycle_state", [
  "pending",
  "active",
  "overdue",
  "restructured",
  "closed",
]);

export const loans = pgTable(
  "loans",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }), // if tenant deleted, cascade loans
    customerProfileId: uuid("customer_profile_id")
      .notNull()
      .references(() => customerProfiles.id, { onDelete: "restrict" }), // prevent deleting a customer with active loans
    productId: uuid("product_id")
      .notNull()
      .references(() => loanProducts.id, { onDelete: "restrict" }),
    principalAmount: numeric("principal_amount", { precision: 15, scale: 2 })
      .notNull()
      .default("0.00"),
    activeBalance: numeric("active_balance", { precision: 15, scale: 2 })
      .notNull()
      .default("0.00"),
    lifecycleState: loanLifecycleEnum("lifecycle_state")
      .default("pending")
      .notNull(),
    termDays: integer("term_days").notNull(),
    maturityDate: timestamp("maturity_date", {
      withTimezone: true,
      mode: "string",
    }).notNull(), // date only, but we use timestamp for simplicity
    disbursedAt: timestamp("disbursed_at", {
      withTimezone: true,
      mode: "string",
    }),
    hostpayReference: varchar("hostpay_reference", { length: 50 }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_loans_tenant").on(table.tenantId),
    index("idx_loans_customer").on(table.customerProfileId),
    index("idx_loans_state").on(table.lifecycleState),
    check("principal_check", sql`${table.principalAmount} > 0`),
    check("balance_check", sql`${table.activeBalance} >= 0`),
  ],
);
