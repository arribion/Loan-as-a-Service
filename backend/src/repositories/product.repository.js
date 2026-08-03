import { eq, and, or, ilike, sql, desc, asc, count, gte, lte } from "drizzle-orm";
import { loanProducts, tenants } from "../config/database/schemas/index.js";
import db from "../config/database/db.js";

/**
 * Coerces numeric database strings into numbers where applicable.
 */
const selectFields = {
    id: loanProducts.id,
    tenantId: loanProducts.tenantId,
    referenceTitle: loanProducts.referenceTitle,
    interestCalculationType: loanProducts.interestCalculationType,
    basePercentage: loanProducts.basePercentage,
    fineRules: loanProducts.fineRules,
    minLoanAmount: loanProducts.minLoanAmount,
    maxLoanAmount: loanProducts.maxLoanAmount,
    minTermDays: loanProducts.minTermDays,
    tenantName: tenants.businessName, // Joined field
};

/**
 * Helper to construct the base query with standard relations.
 * Accepts either standard db instance or a transaction instance (tx).
 */
function getBaseLoanProductQuery(executor = db) {
    return executor
        .select(selectFields)
        .from(loanProducts)
        .leftJoin(tenants, eq(loanProducts.tenantId, tenants.id));
}

export const ProductRepository = {
    /**
     * Find a loan product by ID (optionally scoped to a tenant).
     */
    async findById(id, tenantId = null, tx = db) {
        const conditions = [eq(loanProducts.id, id)];
        if (tenantId) conditions.push(eq(loanProducts.tenantId, tenantId));

        const [product] = await getBaseLoanProductQuery(tx).where(and(...conditions));
        return product || null;
    },

    /**
     * Find a loan product by reference title within a specific tenant.
     */
    async findByTitle(referenceTitle, tenantId, tx = db) {
        const conditions = [
            ilike(loanProducts.referenceTitle, referenceTitle.trim()),
        ];
        if (tenantId) conditions.push(eq(loanProducts.tenantId, tenantId));

        const [product] = await getBaseLoanProductQuery(tx).where(and(...conditions));
        return product || null;
    },

    /**
     * Check if a loan product with a given title already exists under a tenant.
     */
    async existsByTitle(referenceTitle, tenantId, tx = db) {
        const conditions = [
            ilike(loanProducts.referenceTitle, referenceTitle.trim()),
        ];
        if (tenantId) conditions.push(eq(loanProducts.tenantId, tenantId));

        const [{ count: result }] = await tx
            .select({ count: count() })
            .from(loanProducts)
            .where(and(...conditions));

        return Number(result) > 0;
    },

    /**
     * Fetch a paginated list of loan products with rich dynamic filters.
     */
    async findAll(options = {}, tx = db) {
        const {
            tenantId,
            interestCalculationType,
            search,
            amount, // Find products where minLoanAmount <= amount <= maxLoanAmount
            minTermDays,
            page = 1,
            limit = 20,
            sortBy = "referenceTitle",
            sortOrder = "asc",
        } = options;

        const conditions = [];

        if (tenantId) conditions.push(eq(loanProducts.tenantId, tenantId));
        if (interestCalculationType) {
            conditions.push(eq(loanProducts.interestCalculationType, interestCalculationType));
        }
        if (minTermDays !== undefined) {
            conditions.push(gte(loanProducts.minTermDays, minTermDays));
        }
        if (amount !== undefined) {
            const targetAmount = amount.toString();
            conditions.push(
                and(
                    lte(loanProducts.minLoanAmount, targetAmount),
                    gte(loanProducts.maxLoanAmount, targetAmount)
                )
            );
        }

        if (search) {
            conditions.push(ilike(loanProducts.referenceTitle, `%${search}%`));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        const offset = (page - 1) * limit;

        // Mapping dynamic column order options
        const columnMap = {
            referenceTitle: loanProducts.referenceTitle,
            basePercentage: loanProducts.basePercentage,
            minLoanAmount: loanProducts.minLoanAmount,
            maxLoanAmount: loanProducts.maxLoanAmount,
            minTermDays: loanProducts.minTermDays,
        };
        const sortColumn = columnMap[sortBy] || loanProducts.referenceTitle;
        const orderSpec = sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn);

        const [data, [{ total }]] = await Promise.all([
            getBaseLoanProductQuery(tx)
                .where(whereClause)
                .orderBy(orderSpec)
                .limit(limit)
                .offset(offset),
            tx
                .select({ total: count() })
                .from(loanProducts)
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
     * Get all products scoped to a specific tenant.
     */
    async findAllByTenant(tenantId, options = {}, tx = db) {
        return this.findAll({ ...options, tenantId }, tx);
    },

    /**
     * Create a new loan product.
     */
    async create(productData, tx = db) {
        const [newProduct] = await tx
            .insert(loanProducts)
            .values({
                tenantId: productData.tenantId,
                referenceTitle: productData.referenceTitle,
                interestCalculationType: productData.interestCalculationType || "flat",
                basePercentage: productData.basePercentage?.toString() || "1.0000",
                fineRules: productData.fineRules || {},
                minLoanAmount: productData.minLoanAmount?.toString() || "0.00",
                maxLoanAmount: productData.maxLoanAmount.toString(),
                minTermDays: productData.minTermDays,
            })
            .returning();

        return this.findById(newProduct.id, null, tx);
    },

    /**
     * Bulk insert loan products.
     */
    async bulkCreate(productsList, tx = db) {
        const formattedData = productsList.map((p) => ({
            tenantId: p.tenantId,
            referenceTitle: p.referenceTitle,
            interestCalculationType: p.interestCalculationType || "flat",
            basePercentage: p.basePercentage?.toString() || "1.0000",
            fineRules: p.fineRules || {},
            minLoanAmount: p.minLoanAmount?.toString() || "0.00",
            maxLoanAmount: p.maxLoanAmount.toString(),
            minTermDays: p.minTermDays,
        }));

        return tx.insert(loanProducts).values(formattedData).returning();
    },

    /**
     * Dynamically update a loan product's parameters.
     */
    async update(id, updateData, tenantId = null, tx = db) {
        const conditions = [eq(loanProducts.id, id)];
        if (tenantId) conditions.push(eq(loanProducts.tenantId, tenantId));

        const fieldsToUpdate = {};

        if (updateData.referenceTitle !== undefined) {
            fieldsToUpdate.referenceTitle = updateData.referenceTitle;
        }
        if (updateData.interestCalculationType !== undefined) {
            fieldsToUpdate.interestCalculationType = updateData.interestCalculationType;
        }
        if (updateData.basePercentage !== undefined) {
            fieldsToUpdate.basePercentage = updateData.basePercentage.toString();
        }
        if (updateData.fineRules !== undefined) {
            fieldsToUpdate.fineRules = updateData.fineRules;
        }
        if (updateData.minLoanAmount !== undefined) {
            fieldsToUpdate.minLoanAmount = updateData.minLoanAmount.toString();
        }
        if (updateData.maxLoanAmount !== undefined) {
            fieldsToUpdate.maxLoanAmount = updateData.maxLoanAmount.toString();
        }
        if (updateData.minTermDays !== undefined) {
            fieldsToUpdate.minTermDays = updateData.minTermDays;
        }

        if (Object.keys(fieldsToUpdate).length === 0) {
            return this.findById(id, tenantId, tx);
        }

        const [updatedProduct] = await tx
            .update(loanProducts)
            .set(fieldsToUpdate)
            .where(and(...conditions))
            .returning();

        if (!updatedProduct) return null;

        return this.findById(updatedProduct.id, tenantId, tx);
    },

    /**
     * Deep-merge or update fields inside the JSONB fineRules payload using PostgreSQL jsonb_concat (`||`).
     */
    async updateFineRules(id, partialRules, tenantId = null, tx = db) {
        const conditions = [eq(loanProducts.id, id)];
        if (tenantId) conditions.push(eq(loanProducts.tenantId, tenantId));

        const [updatedProduct] = await tx
            .update(loanProducts)
            .set({
                fineRules: sql`${loanProducts.fineRules} || ${JSON.stringify(partialRules)}::jsonb`,
            })
            .where(and(...conditions))
            .returning();

        if (!updatedProduct) return null;

        return this.findById(updatedProduct.id, tenantId, tx);
    },

    /**
     * Delete a loan product by ID.
     */
    async delete(id, tenantId = null, tx = db) {
        const conditions = [eq(loanProducts.id, id)];
        if (tenantId) conditions.push(eq(loanProducts.tenantId, tenantId));

        const [deleted] = await tx
            .delete(loanProducts)
            .where(and(...conditions))
            .returning({ id: loanProducts.id });

        return !!deleted;
    },

    /**
     * Count loan products matching criteria.
     */
    async count(filters = {}, tx = db) {
        const conditions = [];

        if (filters.tenantId) conditions.push(eq(loanProducts.tenantId, filters.tenantId));
        if (filters.interestCalculationType) {
            conditions.push(eq(loanProducts.interestCalculationType, filters.interestCalculationType));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [{ total }] = await tx
            .select({ total: count() })
            .from(loanProducts)
            .where(whereClause);

        return Number(total);
    },
};