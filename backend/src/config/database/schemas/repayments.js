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
import {tenants} from "./tenants.js";
import {loans} from "./loans.js";

export const scheduleStateEnum = pgEnum("schedule_state", [
  "pending",
  "partial",
  "overdue",
]);

export const repaymentSchedules = pgTable(
  "repayment_schedules",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    loanId: uuid("loan_id")
      .notNull()
      .references(() => loans.id, { onDelete: "cascade" }),
    installmentNo: smallint("installment_no").notNull(),
    scheduledAmount: numeric("scheduled_amount", {
      precision: 15,
      scale: 2,
    }).notNull(),
    principalPortion: numeric("principal_portion", {
      precision: 15,
      scale: 2,
    }).notNull(),
    interestPortion: numeric("interest_portion", {
      precision: 15,
      scale: 2,
    }).notNull(),
    targetDueDate: date("target_due_date").notNull(),
    paymentStateFlag: scheduleStateEnum("payment_state_flag")
      .default("pending")
      .notNull(),
    paidAt: timestamp("paid_at", { withTimezone: true, mode: "string" }),
  },
  (table) => [
    index("idx_sched_tenant").on(table.tenantId),
    index("idx_sched_loan").on(table.loanId),
    index("idx_sched_due").on(table.targetDueDate),
  ],
);