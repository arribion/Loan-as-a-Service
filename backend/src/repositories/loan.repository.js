import { eq, and, or, ilike, sql, desc, asc, count, lte, gte } from "drizzle-orm";
import { loans, customerProfiles, loanProducts, tenants } from "../config/database/schemas/index.js";
import db from "../config/database/db.js";

/**
 * Joins related information from customerProfiles, loanProducts, and tenants.
 */
const selectFields = {
    id: loans.id,
    tenantId: loans.tenantId,
    customerProfileId: loans.customerProfileId,
    productId: loans.productId,
    principalAmount: loans.principalAmount,
    activeBalance: loans.activeBalance,
    lifecycleState: loans.lifecycleState,
    termDays: loans.termDays,
    maturityDate: loans.maturityDate,
    disbursedAt: loans.disbursedAt,
    hostpayReference: loans.hostpayReference,
    createdAt: loans.createdAt,
    // Joined fields for enriched responses
    productTitle: loanProducts.referenceTitle,
    tenantName: tenants.businessName,
};

/**
 * Helper to construct the base query with standard relations.
 * Accepts either the default db instance or a transaction instance (tx).
 */
function getBaseLoanQuery(executor = db) {
    return executor
        .select(selectFields)
        .from(loans)
        .leftJoin(loanProducts, eq(loans.productId, loanProducts.id))
        .leftJoin(tenants, eq(loans.tenantId, tenants.id))
        .leftJoin(customerProfiles, eq(loans.customerProfileId, customerProfiles.id));
}

export const LoanRepository = {
    /**
     * Find a loan by its primary key ID (optionally tenant-scoped).
     */
    async findById(id, tenantId = null, tx = db) {
        const conditions = [eq(loans.id, id)];
        if (tenantId) conditions.push(eq(loans.tenantId, tenantId));

        const [loan] = await getBaseLoanQuery(tx).where(and(...conditions));
        return loan || null;
    },

    /**
     * Find a loan by HostPay external payment reference.
     */
    async findByHostpayReference(hostpayReference, tenantId = null, tx = db) {
        const conditions = [eq(loans.hostpayReference, hostpayReference)];
        if (tenantId) conditions.push(eq(loans.tenantId, tenantId));

        const [loan] = await getBaseLoanQuery(tx).where(and(...conditions));
        return loan || null;
    },

    /**
     * List loans for a specific customer profile.
     */
    async findByCustomer(customerProfileId, tenantId = null, tx = db) {
        const conditions = [eq(loans.customerProfileId, customerProfileId)];
        if (tenantId) conditions.push(eq(loans.tenantId, tenantId));

        return getBaseLoanQuery(tx)
            .where(and(...conditions))
            .orderBy(desc(loans.createdAt));
    },

    /**
     * Fetch a paginated, filtered, and sorted list of loans.
     */
    async findAll(options = {}, tx = db) {
        const {
            tenantId,
            customerProfileId,
            productId,
            lifecycleState,
            isOverdue, // Boolean helper filter for active loans past maturity
            search, // HostPay reference search
            page = 1,
            limit = 20,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = options;

        const conditions = [];

        if (tenantId) conditions.push(eq(loans.tenantId, tenantId));
        if (customerProfileId) conditions.push(eq(loans.customerProfileId, customerProfileId));
        if (productId) conditions.push(eq(loans.productId, productId));
        if (lifecycleState) conditions.push(eq(loans.lifecycleState, lifecycleState));

        if (isOverdue) {
            conditions.push(
                and(
                    eq(loans.lifecycleState, "active"),
                    lte(loans.maturityDate, new Date().toISOString())
                )
            );
        }

        if (search) {
            conditions.push(ilike(loans.hostpayReference, `%${search}%`));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        const offset = (page - 1) * limit;

        const columnMap = {
            createdAt: loans.createdAt,
            principalAmount: loans.principalAmount,
            activeBalance: loans.activeBalance,
            maturityDate: loans.maturityDate,
            lifecycleState: loans.lifecycleState,
        };
        const sortColumn = columnMap[sortBy] || loans.createdAt;
        const orderSpec = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

        const [data, [{ total }]] = await Promise.all([
            getBaseLoanQuery(tx)
                .where(whereClause)
                .orderBy(orderSpec)
                .limit(limit)
                .offset(offset),
            tx
                .select({ total: count() })
                .from(loans)
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
     * List all loans for a specific tenant.
     */
    async findAllByTenant(tenantId, options = {}, tx = db) {
        return this.findAll({ ...options, tenantId }, tx);
    },

    /**
     * Create a new loan record (starts in "pending" lifecycle state by default).
     */
    async create(loanData, tx = db) {
        const [newLoan] = await tx
            .insert(loans)
            .values({
                tenantId: loanData.tenantId,
                customerProfileId: loanData.customerProfileId,
                productId: loanData.productId,
                principalAmount: loanData.principalAmount.toString(),
                activeBalance: (loanData.activeBalance ?? loanData.principalAmount).toString(),
                lifecycleState: loanData.lifecycleState || "pending",
                termDays: loanData.termDays,
                maturityDate: loanData.maturityDate,
                disbursedAt: loanData.disbursedAt || null,
                hostpayReference: loanData.hostpayReference || null,
            })
            .returning();

        return this.findById(newLoan.id, null, tx);
    },

    /**
     * Bulk create loans.
     */
    async bulkCreate(loansList, tx = db) {
        const formattedData = loansList.map((l) => ({
            tenantId: l.tenantId,
            customerProfileId: l.customerProfileId,
            productId: l.productId,
            principalAmount: l.principalAmount.toString(),
            activeBalance: (l.activeBalance ?? l.principalAmount).toString(),
            lifecycleState: l.lifecycleState || "pending",
            termDays: l.termDays,
            maturityDate: l.maturityDate,
            disbursedAt: l.disbursedAt || null,
            hostpayReference: l.hostpayReference || null,
        }));

        return tx.insert(loans).values(formattedData).returning();
    },

    /**
     * Mark loan as disbursed (transitions state to "active" and assigns disbursement timestamp).
     */
    async disburse(id, hostpayReference = null, tenantId = null, tx = db) {
        const conditions = [eq(loans.id, id)];
        if (tenantId) conditions.push(eq(loans.tenantId, tenantId));

        const [updatedLoan] = await tx
            .update(loans)
            .set({
                lifecycleState: "active",
                disbursedAt: new Date().toISOString(),
                ...(hostpayReference && { hostpayReference: hostpayReference }),
            })
            .where(and(...conditions))
            .returning();

        if (!updatedLoan) return null;
        return this.findById(updatedLoan.id, tenantId, tx);
    },

    /**
     * Reduce or update active loan balance (e.g. upon payment reception).
     */
    async updateBalance(id, newBalance, tenantId = null, tx = db) {
        const conditions = [eq(loans.id, id)];
        if (tenantId) conditions.push(eq(loans.tenantId, tenantId));

        const numericBalance = Number(newBalance);
        const updates = {
            activeBalance: numericBalance.toFixed(2),
        };

        // Auto-close loan if active balance is zero
        if (numericBalance <= 0) {
            updates.lifecycleState = "closed";
        }

        const [updatedLoan] = await tx
            .update(loans)
            .set(updates)
            .where(and(...conditions))
            .returning();

        if (!updatedLoan) return null;
        return this.findById(updatedLoan.id, tenantId, tx);
    },

    /**
     * Update lifecycle state manually (pending, active, overdue, restructured, closed).
     */
    async updateLifecycleState(id, lifecycleState, tenantId = null, tx = db) {
        const conditions = [eq(loans.id, id)];
        if (tenantId) conditions.push(eq(loans.tenantId, tenantId));

        const [updatedLoan] = await tx
            .update(loans)
            .set({ lifecycleState: lifecycleState })
            .where(and(...conditions))
            .returning();

        if (!updatedLoan) return null;
        return this.findById(updatedLoan.id, tenantId, tx);
    },

    /**
     * General dynamic update method for loans.
     */
    async update(id, updateData, tenantId = null, tx = db) {
        const conditions = [eq(loans.id, id)];
        if (tenantId) conditions.push(eq(loans.tenantId, tenantId));

        const fieldsToUpdate = {};

        if (updateData.principalAmount !== undefined) {
            fieldsToUpdate.principalAmount = updateData.principalAmount.toString();
        }
        if (updateData.activeBalance !== undefined) {
            fieldsToUpdate.activeBalance = updateData.activeBalance.toString();
        }
        if (updateData.lifecycleState !== undefined) {
            fieldsToUpdate.lifecycleState = updateData.lifecycleState;
        }
        if (updateData.termDays !== undefined) {
            fieldsToUpdate.termDays = updateData.termDays;
        }
        if (updateData.maturityDate !== undefined) {
            fieldsToUpdate.maturityDate = updateData.maturityDate;
        }
        if (updateData.disbursedAt !== undefined) {
            fieldsToUpdate.disbursedAt = updateData.disbursedAt;
        }
        if (updateData.hostpayReference !== undefined) {
            fieldsToUpdate.hostpayReference = updateData.hostpayReference;
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return this.findById(id, tenantId, tx);
        }

        const [updatedLoan] = await tx
            .update(loans)
            .set(fieldsToUpdate)
            .where(and(...conditions))
            .returning();

        if (!updatedLoan) return null;
        return this.findById(updatedLoan.id, tenantId, tx);
    },

    /**
     * Delete a loan record by ID.
     */
    async delete(id, tenantId = null, tx = db) {
        const conditions = [eq(loans.id, id)];
        if (tenantId) conditions.push(eq(loans.tenantId, tenantId));

        const [deleted] = await tx
            .delete(loans)
            .where(and(...conditions))
            .returning({ id: loans.id });

        return !!deleted;
    },

    /**
     * Aggregate stats for loans (total count, sum of principal, sum of active balance).
     */
    async getMetrics(tenantId = null, tx = db) {
        const conditions = [];
        if (tenantId) conditions.push(eq(loans.tenantId, tenantId));

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [metrics] = await tx
            .select({
                totalLoans: count(),
                totalPrincipal: sql`COALESCE(SUM(${loans.principalAmount}), 0)`,
                totalActiveBalance: sql`COALESCE(SUM(${loans.activeBalance}), 0)`,
            })
            .from(loans)
            .where(whereClause);

        return {
            totalLoans: Number(metrics.totalLoans),
            totalPrincipal: Number(metrics.totalPrincipal),
            totalActiveBalance: Number(metrics.totalActiveBalance),
        };
    },
};