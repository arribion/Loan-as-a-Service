import { eq, and, or, ilike, sql, desc, asc, count, gte, lte } from "drizzle-orm";
import { transactions, loans, tenants } from "../config/database/schemas/index.js";
import db from "../config/database/db.js";

/**
 * Includes joined data from loans and tenants.
 */
const selectFields = {
    id: transactions.id,
    tenantId: transactions.tenantId,
    loanId: transactions.loanId,
    externalReceiptReference: transactions.externalReceiptReference,
    ledgerDirection: transactions.ledgerDirection,
    transactionType: transactions.transactionType,
    rawAmount: transactions.rawAmount,
    penaltyPortion: transactions.penaltyPortion,
    interestPortion: transactions.interestPortion,
    principalPortion: transactions.principalPortion,
    logTimestamp: transactions.logTimestamp,
    // Joined fields
    hostpayReference: loans.hostpayReference,
    tenantName: tenants.businessName,
};

/**
 * Helper to construct the base query with standard relations.
 * Accepts either the default db instance or a transaction instance (tx).
 */
function getBaseTransactionQuery(executor = db) {
    return executor
        .select(selectFields)
        .from(transactions)
        .leftJoin(loans, eq(transactions.loanId, loans.id))
        .leftJoin(tenants, eq(transactions.tenantId, tenants.id));
}

export const TransactionRepository = {
    /**
     * Find a transaction by ID.
     */
    async findById(id, tenantId = null, tx = db) {
        const conditions = [eq(transactions.id, id)];
        if (tenantId) conditions.push(eq(transactions.tenantId, tenantId));

        const [transaction] = await getBaseTransactionQuery(tx).where(and(...conditions));
        return transaction || null;
    },

    /**
     * Find a transaction by external receipt reference (e.g., M-Pesa / HostPay receipt ID).
     */
    async findByExternalReference(receiptRef, tenantId = null, tx = db) {
        const conditions = [eq(transactions.externalReceiptReference, receiptRef.trim())];
        if (tenantId) conditions.push(eq(transactions.tenantId, tenantId));

        const [transaction] = await getBaseTransactionQuery(tx).where(and(...conditions));
        return transaction || null;
    },

    /**
     * Check if a transaction with the given external receipt reference already exists.
     */
    async existsByExternalReference(receiptRef, tx = db) {
        const [{ count: result }] = await tx
            .select({ count: count() })
            .from(transactions)
            .where(eq(transactions.externalReceiptReference, receiptRef.trim()));

        return Number(result) > 0;
    },

    /**
     * Fetch all transactions belonging to a specific loan.
     */
    async findByLoanId(loanId, tenantId = null, tx = db) {
        const conditions = [eq(transactions.loanId, loanId)];
        if (tenantId) conditions.push(eq(transactions.tenantId, tenantId));

        return getBaseTransactionQuery(tx)
            .where(and(...conditions))
            .orderBy(desc(transactions.logTimestamp));
    },

    /**
     * List transactions with filtering, date range, pagination, and sorting.
     */
    async findAll(options = {}, tx = db) {
        const {
            tenantId,
            loanId,
            transactionType,
            ledgerDirection,
            startDate,
            endDate,
            search, // Search by external receipt reference
            page = 1,
            limit = 20,
            sortBy = "logTimestamp",
            sortOrder = "desc",
        } = options;

        const conditions = [];

        if (tenantId) conditions.push(eq(transactions.tenantId, tenantId));
        if (loanId) conditions.push(eq(transactions.loanId, loanId));
        if (transactionType) conditions.push(eq(transactions.transactionType, transactionType));
        if (ledgerDirection) conditions.push(eq(transactions.ledgerDirection, ledgerDirection));

        if (startDate) conditions.push(gte(transactions.logTimestamp, new Date(startDate)));
        if (endDate) conditions.push(lte(transactions.logTimestamp, new Date(endDate)));

        if (search) {
            conditions.push(ilike(transactions.externalReceiptReference, `%${search.trim()}%`));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        const offset = (page - 1) * limit;

        const columnMap = {
            logTimestamp: transactions.logTimestamp,
            rawAmount: transactions.rawAmount,
            transactionType: transactions.transactionType,
            ledgerDirection: transactions.ledgerDirection,
        };
        const sortColumn = columnMap[sortBy] || transactions.logTimestamp;
        const orderSpec = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

        const [data, [{ total }]] = await Promise.all([
            getBaseTransactionQuery(tx)
                .where(whereClause)
                .orderBy(orderSpec)
                .limit(limit)
                .offset(offset),
            tx
                .select({ total: count() })
                .from(transactions)
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
     * List all transactions for a specific tenant.
     */
    async findAllByTenant(tenantId, options = {}, tx = db) {
        return this.findAll({ ...options, tenantId }, tx);
    },

    /**
     * Create a single transaction log entry.
     */
    async create(txnData, tx = db) {
        const [newTxn] = await tx
            .insert(transactions)
            .values({
                tenantId: txnData.tenantId,
                loanId: txnData.loanId,
                externalReceiptReference: txnData.externalReceiptReference || null,
                ledgerDirection: txnData.ledgerDirection,
                transactionType: txnData.transactionType,
                rawAmount: txnData.rawAmount.toString(),
                penaltyPortion: (txnData.penaltyPortion ?? "0.00").toString(),
                interestPortion: (txnData.interestPortion ?? "0.00").toString(),
                principalPortion: (txnData.principalPortion ?? "0.00").toString(),
                logTimestamp: txnData.logTimestamp ? new Date(txnData.logTimestamp) : undefined,
            })
            .returning();

        return this.findById(newTxn.id, null, tx);
    },

    /**
     * Bulk create transactions.
     */
    async bulkCreate(transactionsList, tx = db) {
        const formattedData = transactionsList.map((t) => ({
            tenantId: t.tenantId,
            loanId: t.loanId,
            externalReceiptReference: t.externalReceiptReference || null,
            ledgerDirection: t.ledgerDirection,
            transactionType: t.transactionType,
            rawAmount: t.rawAmount.toString(),
            penaltyPortion: (t.penaltyPortion ?? "0.00").toString(),
            interestPortion: (t.interestPortion ?? "0.00").toString(),
            principalPortion: (t.principalPortion ?? "0.00").toString(),
            logTimestamp: t.logTimestamp ? new Date(t.logTimestamp) : undefined,
        }));

        return tx.insert(transactions).values(formattedData).returning();
    },

    /**
     * Update a transaction record.
     */
    async update(id, updateData, tenantId = null, tx = db) {
        const conditions = [eq(transactions.id, id)];
        if (tenantId) conditions.push(eq(transactions.tenantId, tenantId));

        const fieldsToUpdate = {};

        if (updateData.externalReceiptReference !== undefined) {
            fieldsToUpdate.externalReceiptReference = updateData.externalReceiptReference;
        }
        if (updateData.ledgerDirection !== undefined) {
            fieldsToUpdate.ledgerDirection = updateData.ledgerDirection;
        }
        if (updateData.transactionType !== undefined) {
            fieldsToUpdate.transactionType = updateData.transactionType;
        }
        if (updateData.rawAmount !== undefined) {
            fieldsToUpdate.rawAmount = updateData.rawAmount.toString();
        }
        if (updateData.penaltyPortion !== undefined) {
            fieldsToUpdate.penaltyPortion = updateData.penaltyPortion.toString();
        }
        if (updateData.interestPortion !== undefined) {
            fieldsToUpdate.interestPortion = updateData.interestPortion.toString();
        }
        if (updateData.principalPortion !== undefined) {
            fieldsToUpdate.principalPortion = updateData.principalPortion.toString();
        }
        if (updateData.logTimestamp !== undefined) {
            fieldsToUpdate.logTimestamp = new Date(updateData.logTimestamp);
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return this.findById(id, tenantId, tx);
        }

        const [updatedTxn] = await tx
            .update(transactions)
            .set(fieldsToUpdate)
            .where(and(...conditions))
            .returning();

        if (!updatedTxn) return null;
        return this.findById(updatedTxn.id, tenantId, tx);
    },

    /**
     * Delete a transaction record by ID.
     */
    async delete(id, tenantId = null, tx = db) {
        const conditions = [eq(transactions.id, id)];
        if (tenantId) conditions.push(eq(transactions.tenantId, tenantId));

        const [deleted] = await tx
            .delete(transactions)
            .where(and(...conditions))
            .returning({ id: transactions.id });

        return !!deleted;
    },

    /**
     * Calculate ledger totals and portion breakdown (rawAmount, principal, interest, penalty).
     */
    async getSummary(filters = {}, tx = db) {
        const conditions = [];

        if (filters.tenantId) conditions.push(eq(transactions.tenantId, filters.tenantId));
        if (filters.loanId) conditions.push(eq(transactions.loanId, filters.loanId));
        if (filters.transactionType) conditions.push(eq(transactions.transactionType, filters.transactionType));
        if (filters.ledgerDirection) conditions.push(eq(transactions.ledgerDirection, filters.ledgerDirection));
        if (filters.startDate) conditions.push(gte(transactions.logTimestamp, new Date(filters.startDate)));
        if (filters.endDate) conditions.push(lte(transactions.logTimestamp, new Date(filters.endDate)));

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [summary] = await tx
            .select({
                totalCount: count(),
                totalRawAmount: sql`COALESCE(SUM(${transactions.rawAmount}), 0)`,
                totalPrincipalPortion: sql`COALESCE(SUM(${transactions.principalPortion}), 0)`,
                totalInterestPortion: sql`COALESCE(SUM(${transactions.interestPortion}), 0)`,
                totalPenaltyPortion: sql`COALESCE(SUM(${transactions.penaltyPortion}), 0)`,
            })
            .from(transactions)
            .where(whereClause);

        return {
            totalCount: Number(summary.totalCount),
            totalRawAmount: Number(summary.totalRawAmount),
            totalPrincipalPortion: Number(summary.totalPrincipalPortion),
            totalInterestPortion: Number(summary.totalInterestPortion),
            totalPenaltyPortion: Number(summary.totalPenaltyPortion),
        };
    },
};