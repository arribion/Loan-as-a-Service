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
import tenants from "./tenants.js";
import customerProfiles from "./customer_profiles.js";
import loanProducts from "./loan_products.js";

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
    tenant_id: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }), // if tenant deleted, cascade loans
    customer_profile_id: uuid("customer_profile_id")
      .notNull()
      .references(() => customerProfiles.id, { onDelete: "restrict" }), // prevent deleting a customer with active loans
    product_id: uuid("product_id")
      .notNull()
      .references(() => loanProducts.id, { onDelete: "restrict" }),
    principal_amount: numeric("principal_amount", { precision: 15, scale: 2 })
      .notNull()
      .default("0.00"),
    active_balance: numeric("active_balance", { precision: 15, scale: 2 })
      .notNull()
      .default("0.00"),
    lifecycle_state: loanLifecycleEnum("lifecycle_state")
      .default("pending")
      .notNull(),
    term_days: integer("term_days").notNull(),
    maturity_date: timestamp("maturity_date", {
      withTimezone: true,
      mode: "string",
    }).notNull(), // date only, but we use timestamp for simplicity
    disbursed_at: timestamp("disbursed_at", {
      withTimezone: true,
      mode: "string",
    }),
    hostpay_reference: varchar("hostpay_reference", { length: 50 }),
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_loans_tenant").on(table.tenant_id),
    index("idx_loans_customer").on(table.customer_profile_id),
    index("idx_loans_state").on(table.lifecycle_state),
    check("principal_check", sql`${table.principal_amount} > 0`),
    check("balance_check", sql`${table.active_balance} >= 0`),
  ],
);

export default loans;
