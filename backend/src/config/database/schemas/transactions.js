import {
  pgTable,
  uuid,
  numeric,
  varchar,
  pgEnum,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
// referencies
import tenants from "./tenants.js";
import loans from "./loans.js";

export const transactionTypeEnum = pgEnum("transaction_type", [
  "disbursement",
  "repayment",
  "penalty_charge",
  "interest_accrual",
  "waiver",
  "write_off",
]);

export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "completed",
  "failed",
  "reversed",
]);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    tenant_id: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id),
    loan_id: uuid("loan_id")
      .notNull()
      .references(() => loans.id),
    type: transactionTypeEnum("type").notNull().default("repayment"),
    status: transactionStatusEnum("status").default("pending").notNull(),
    amount: numeric("amount", { precision: 15, scale: 2 }).notNull().default("0.00"), // Absolute value, direction determined by type
    metadata: jsonb("metadata").default(sql`"{}"::jsonb`).notNull(), // Store internal ledger logs or gateway codes
    created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_transactions_tenant").on(table.tenant_id),
    index("idx_transactions_loan").on(table.loan_id),
    index("idx_transactions_type_status").on(table.type, table.status),
  ],
);

export default transactions;