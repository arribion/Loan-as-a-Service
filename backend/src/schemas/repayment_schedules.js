import {
  pgTable,
  uuid,
  numeric,
  varchar,
  pgEnum,
  timestamp,
  index,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { tenants } from "./tenants";
import { loans } from "./loans";

export const repaymentMethodEnum = pgEnum("repayment_method", [
  "m_pesa",
  "bank_transfer",
  "ach",
  "card",
  "internal_wallet",
]);

export const repayments = pgTable(
  "repayments",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    tenant_id: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id),
    loan_id: uuid("loan_id")
      .notNull()
      .references(() => loans.id, { onDelete: "cascade" }),
    amount_paid: numeric("amount_paid", { precision: 15, scale: 2 }).notNull(),
    principal_component: numeric("principal_component", {
      precision: 15,
      scale: 2,
    }).notNull(),
    interest_component: numeric("interest_component", {
      precision: 15,
      scale: 2,
    }).notNull(),
    penalty_component: numeric("penalty_component", { precision: 15, scale: 2 })
      .default("0.00")
      .notNull(),
    payment_method: repaymentMethodEnum("payment_method").notNull(),
    external_reference: varchar("external_reference", { length: 100 }).unique(), //  M-Pesa/Bank Tx Reference ID
    received_at: timestamp("received_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_repayments_tenant").on(table.tenant_id),
    index("idx_repayments_loan").on(table.loan_id),
    index("idx_repayments_ref").on(table.external_reference),
    check("amount_paid_check", sql`${table.amount_paid} > 0`),
  ],
);
