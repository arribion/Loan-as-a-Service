import { eq, and, lte, gte, asc, desc, count, sql } from "drizzle-orm";
import { repaymentSchedules, loans, tenants } from "../config/database/schemas/index.js";
import db from "../config/database/db.js";

const selectFields = {
    id: repaymentSchedules.id,
    tenantId: repaymentSchedules.tenantId,
    loanId: repaymentSchedules.loanId,
    installmentNo: repaymentSchedules.installmentNo,
    scheduledAmount: repaymentSchedules.scheduledAmount,
    principalPortion: repaymentSchedules.principalPortion,
    interestPortion: repaymentSchedules.interestPortion,
    targetDueDate: repaymentSchedules.targetDueDate,
    paymentStateFlag: repaymentSchedules.paymentStateFlag,
    paidAt: repaymentSchedules.paidAt,
    // Joined context
    hostpayReference: loans.hostpayReference,
    tenantName: tenants.businessName,
};

/**
 * Helper to construct the base query with standard relations.
 * Accepts either the default db instance or a transaction instance (tx).
 */
function getBaseRepaymentScheduleQuery(executor = db) {
    return executor
        .select(selectFields)
        .from(repaymentSchedules)
        .leftJoin(loans, eq(repaymentSchedules.loanId, loans.id))
        .leftJoin(tenants, eq(repaymentSchedules.tenantId, tenants.id));
}

export const RepaymentScheduleRepository = {
    /**
     * Find a repayment schedule entry by ID.
     */
    async findById(id, tenantId = null, tx = db) {
        const conditions = [eq(repaymentSchedules.id, id)];
        if (tenantId) conditions.push(eq(repaymentSchedules.tenantId, tenantId));

        const [schedule] = await getBaseRepaymentScheduleQuery(tx).where(and(...conditions));
        return schedule || null;
    },

    /**
     * Find all installment schedules for a given loan ordered chronologically.
     */
    async findByLoanId(loanId, tenantId = null, tx = db) {
        const conditions = [eq(repaymentSchedules.loanId, loanId)];
        if (tenantId) conditions.push(eq(repaymentSchedules.tenantId, tenantId));

        return getBaseRepaymentScheduleQuery(tx)
            .where(and(...conditions))
            .orderBy(asc(repaymentSchedules.installmentNo));
    },

    /**
     * Find a specific installment by loan ID and installment number.
     */
    async findByInstallmentNo(loanId, installmentNo, tenantId = null, tx = db) {
        const conditions = [
            eq(repaymentSchedules.loanId, loanId),
            eq(repaymentSchedules.installmentNo, installmentNo),
        ];
        if (tenantId) conditions.push(eq(repaymentSchedules.tenantId, tenantId));

        const [installment] = await getBaseRepaymentScheduleQuery(tx).where(and(...conditions));
        return installment || null;
    },

    /**
     * Find the next unpaid or partially paid installment for a loan.
     */
    async findNextDueInstallment(loanId, tenantId = null, tx = db) {
        const conditions = [
            eq(repaymentSchedules.loanId, loanId),
            sql`${repaymentSchedules.paymentStateFlag} IN ('pending', 'partial', 'overdue')`,
        ];
        if (tenantId) conditions.push(eq(repaymentSchedules.tenantId, tenantId));

        const [nextSchedule] = await getBaseRepaymentScheduleQuery(tx)
            .where(and(...conditions))
            .orderBy(asc(repaymentSchedules.installmentNo))
            .limit(1);

        return nextSchedule || null;
    },

    /**
     * Fetch a paginated list of repayment schedules with date and state filters.
     */
    async findAll(options = {}, tx = db) {
        const {
            tenantId,
            loanId,
            paymentStateFlag,
            dueBefore,
            dueAfter,
            isOverdueOnly,
            page = 1,
            limit = 20,
            sortBy = "targetDueDate",
            sortOrder = "asc",
        } = options;

        const conditions = [];

        if (tenantId) conditions.push(eq(repaymentSchedules.tenantId, tenantId));
        if (loanId) conditions.push(eq(repaymentSchedules.loanId, loanId));
        if (paymentStateFlag) {
            conditions.push(eq(repaymentSchedules.paymentStateFlag, paymentStateFlag));
        }

        if (dueBefore) conditions.push(lte(repaymentSchedules.targetDueDate, dueBefore));
        if (dueAfter) conditions.push(gte(repaymentSchedules.targetDueDate, dueAfter));

        if (isOverdueOnly) {
            const today = new Date().toISOString().split("T")[0];
            conditions.push(
                and(
                    lte(repaymentSchedules.targetDueDate, today),
                    sql`${repaymentSchedules.paymentStateFlag} != 'paid'`
                )
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        const offset = (page - 1) * limit;

        const columnMap = {
            targetDueDate: repaymentSchedules.targetDueDate,
            installmentNo: repaymentSchedules.installmentNo,
            scheduledAmount: repaymentSchedules.scheduledAmount,
            paymentStateFlag: repaymentSchedules.paymentStateFlag,
        };
        const sortColumn = columnMap[sortBy] || repaymentSchedules.targetDueDate;
        const orderSpec = sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn);

        const [data, [{ total }]] = await Promise.all([
            getBaseRepaymentScheduleQuery(tx)
                .where(whereClause)
                .orderBy(orderSpec)
                .limit(limit)
                .offset(offset),
            tx
                .select({ total: count() })
                .from(repaymentSchedules)
                .where(whereClause),
        ]);

        const totalItems = Number(total);

        return {
            data,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        };
    },

    /**
     * Create a single repayment schedule entry.
     */
    async create(scheduleData, tx = db) {
        const [newSchedule] = await tx
            .insert(repaymentSchedules)
            .values({
                tenantId: scheduleData.tenantId,
                loanId: scheduleData.loanId,
                installmentNo: scheduleData.installmentNo,
                scheduledAmount: scheduleData.scheduledAmount.toString(),
                principalPortion: scheduleData.principalPortion.toString(),
                interestPortion: scheduleData.interestPortion.toString(),
                targetDueDate: scheduleData.targetDueDate,
                paymentStateFlag: scheduleData.paymentStateFlag || "pending",
                paidAt: scheduleData.paidAt || null,
            })
            .returning();

        return this.findById(newSchedule.id, null, tx);
    },

    /**
     * Bulk insert an entire loan amortization schedule.
     */
    async bulkCreate(scheduleList, tx = db) {
        const formattedData = scheduleList.map((s) => ({
            tenantId: s.tenantId,
            loanId: s.loanId,
            installmentNo: s.installmentNo,
            scheduledAmount: s.scheduledAmount.toString(),
            principalPortion: s.principalPortion.toString(),
            interestPortion: s.interestPortion.toString(),
            targetDueDate: s.targetDueDate,
            paymentStateFlag: s.paymentStateFlag || "pending",
            paidAt: s.paidAt || null,
        }));

        return tx.insert(repaymentSchedules).values(formattedData).returning();
    },

    /**
     * Update state flag and timestamp of a schedule item (e.g., pending -> partial -> overdue).
     */
    async updateState(id, paymentStateFlag, paidAt = null, tenantId = null, tx = db) {
        const conditions = [eq(repaymentSchedules.id, id)];
        if (tenantId) conditions.push(eq(repaymentSchedules.tenantId, tenantId));

        const [updated] = await tx
            .update(repaymentSchedules)
            .set({
                paymentStateFlag: paymentStateFlag,
                paidAt: paidAt || (paymentStateFlag === "partial" ? new Date().toISOString() : null),
            })
            .where(and(...conditions))
            .returning();

        if (!updated) return null;
        return this.findById(updated.id, tenantId, tx);
    },

    /**
     * General dynamic update method for repayment schedule rows.
     */
    async update(id, updateData, tenantId = null, tx = db) {
        const conditions = [eq(repaymentSchedules.id, id)];
        if (tenantId) conditions.push(eq(repaymentSchedules.tenantId, tenantId));

        const fieldsToUpdate = {};

        if (updateData.installmentNo !== undefined) fieldsToUpdate.installmentNo = updateData.installmentNo;
        if (updateData.scheduledAmount !== undefined) fieldsToUpdate.scheduledAmount = updateData.scheduledAmount.toString();
        if (updateData.principalPortion !== undefined) fieldsToUpdate.principalPortion = updateData.principalPortion.toString();
        if (updateData.interestPortion !== undefined) fieldsToUpdate.interestPortion = updateData.interestPortion.toString();
        if (updateData.targetDueDate !== undefined) fieldsToUpdate.targetDueDate = updateData.targetDueDate;
        if (updateData.paymentStateFlag !== undefined) fieldsToUpdate.paymentStateFlag = updateData.paymentStateFlag;
        if (updateData.paidAt !== undefined) fieldsToUpdate.paidAt = updateData.paidAt;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return this.findById(id, tenantId, tx);
        }

        const [updated] = await tx
            .update(repaymentSchedules)
            .set(fieldsToUpdate)
            .where(and(...conditions))
            .returning();

        if (!updated) return null;
        return this.findById(updated.id, tenantId, tx);
    },

    /**
     * Delete a single schedule row by ID.
     */
    async delete(id, tenantId = null, tx = db) {
        const conditions = [eq(repaymentSchedules.id, id)];
        if (tenantId) conditions.push(eq(repaymentSchedules.tenantId, tenantId));

        const [deleted] = await tx
            .delete(repaymentSchedules)
            .where(and(...conditions))
            .returning({ id: repaymentSchedules.id });

        return !!deleted;
    },

    /**
     * Delete all schedule rows associated with a loan (useful prior to restructuring).
     */
    async deleteByLoanId(loanId, tenantId = null, tx = db) {
        const conditions = [eq(repaymentSchedules.loanId, loanId)];
        if (tenantId) conditions.push(eq(repaymentSchedules.tenantId, tenantId));

        const deleted = await tx
            .delete(repaymentSchedules)
            .where(and(...conditions))
            .returning({ id: repaymentSchedules.id });

        return deleted.length;
    },

    /**
     * Flag all pending schedules past their target due date as 'overdue'.
     */
    async markOverdueSchedules(tenantId = null, tx = db) {
        const today = new Date().toISOString().split("T")[0];
        const conditions = [
            lte(repaymentSchedules.targetDueDate, today),
            eq(repaymentSchedules.paymentStateFlag, "pending"),
        ];

        if (tenantId) conditions.push(eq(repaymentSchedules.tenantId, tenantId));

        const updated = await tx
            .update(repaymentSchedules)
            .set({ paymentStateFlag: "overdue" })
            .where(and(...conditions))
            .returning({ id: repaymentSchedules.id });

        return updated.length;
    },
};