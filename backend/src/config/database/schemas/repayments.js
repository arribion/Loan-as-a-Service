import {
  pgTable,
  uuid,
  pgEnum,
  smallint,
  numeric,
  date,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import tenants from "./tenants.js";
import loans from "./loans.js";

export const scheduleStateEnum = pgEnum("schedule_state", [
  "pending",
  "partial",
  "overdue",
]);

export const repayment_schedules = pgTable(
  "repayment_schedules",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    tenant_id: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    loan_id: uuid("loan_id")
      .notNull()
      .references(() => loans.id, { onDelete: "cascade" }),
    installment_no: smallint("installment_no").notNull(),
    scheduled_amount: numeric("scheduled_amount", {
      precision: 15,
      scale: 2,
    }).notNull(),
    principal_portion: numeric("principal_portion", {
      precision: 15,
      scale: 2,
    }).notNull(),
    interest_portion: numeric("interest_portion", {
      precision: 15,
      scale: 2,
    }).notNull(),
    target_due_date: date("target_due_date").notNull(),
    payment_state_flag: scheduleStateEnum("payment_state_flag")
      .default("pending")
      .notNull(),
    paid_at: timestamp("paid_at", { withTimezone: true, mode: "string" }),
  },
  (table) => [
    index("idx_sched_tenant").on(table.tenant_id),
    index("idx_sched_loan").on(table.loan_id),
    index("idx_sched_due").on(table.target_due_date),
  ],
);

export default repayment_schedules;