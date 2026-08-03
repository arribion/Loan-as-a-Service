import { eq, and, or, ilike, sql, desc, asc, count } from "drizzle-orm";
import { tenants } from "../config/database/schemas/index.js/tenants.js";
import db from "../config/database/db.js";

const selectFields = {
    id: tenants.id,
    businessName: tenants.businessName,
    packageTier: tenants.packageTier,
    configurationPayload: tenants.configurationPayload,
    isActive: tenants.isActive,
    createdAt: tenants.createdAt,
};

/**
 * Helper to get base query.
 * Accepts either standard db instance or a transaction instance (tx).
 */
function getBaseTenantQuery(executor = db) {
    return executor.select(selectFields).from(tenants);
}

export const TenantRepository = {
    /**
     * Find a tenant by primary ID.
     */
    async findById(id, tx = db) {
        const [tenant] = await getBaseTenantQuery(tx).where(eq(tenants.id, id));
        return tenant || null;
    },

    /**
     * Find a tenant by business name (exact match, case-insensitive).
     */
    async findByName(businessName, tx = db) {
        const [tenant] = await getBaseTenantQuery(tx).where(
            ilike(tenants.businessName, businessName.trim())
        );
        return tenant || null;
    },

    /**
     * Check if a business name is already registered.
     */
    async existsByName(businessName, tx = db) {
        const [{ count: result }] = await tx
            .select({ count: count() })
            .from(tenants)
            .where(ilike(tenants.businessName, businessName.trim()));

        return Number(result) > 0;
    },

    /**
     * List tenants with filtering, search, pagination, and sorting.
     */
    async findAll(options = {}, tx = db) {
        const {
            packageTier,
            isActive,
            search,
            page = 1,
            limit = 20,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = options;

        const conditions = [];

        if (packageTier) conditions.push(eq(tenants.packageTier, packageTier));
        if (typeof isActive === "boolean") conditions.push(eq(tenants.isActive, isActive));

        if (search) {
            conditions.push(ilike(tenants.businessName, `%${search}%`));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        const offset = (page - 1) * limit;

        // Resolve dynamic column ordering
        const sortColumn = tenants[sortBy] || tenants.createdAt;
        const orderSpec = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

        const [data, [{ total }]] = await Promise.all([
            getBaseTenantQuery(tx)
                .where(whereClause)
                .orderBy(orderSpec)
                .limit(limit)
                .offset(offset),
            tx
                .select({ total: count() })
                .from(tenants)
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
     * Create a new tenant record.
     */
    async create(tenantData, tx = db) {
        const [newTenant] = await tx
            .insert(tenants)
            .values({
                businessName: tenantData.businessName,
                packageTier: tenantData.packageTier || "lite",
                configurationPayload: tenantData.configurationPayload || {},
                isActive: tenantData.isActive ?? true,
            })
            .returning();

        return this.findById(newTenant.id, tx);
    },

    /**
     * Bulk insert multiple tenants.
     */
    async bulkCreate(tenantsList, tx = db) {
        const formattedData = tenantsList.map((t) => ({
            businessName: t.businessName,
            packageTier: t.packageTier || "lite",
            configurationPayload: t.configurationPayload || {},
            isActive: t.isActive ?? true,
        }));

        return tx.insert(tenants).values(formattedData).returning();
    },

    /**
     * Update tenant properties dynamically.
     */
    async update(id, updateData, tx = db) {
        const fieldsToUpdate = {};

        if (updateData.businessName !== undefined) fieldsToUpdate.businessName = updateData.businessName;
        if (updateData.packageTier !== undefined) fieldsToUpdate.packageTier = updateData.packageTier;
        if (updateData.configurationPayload !== undefined) {
            fieldsToUpdate.configurationPayload = updateData.configurationPayload;
        }
        if (updateData.isActive !== undefined) fieldsToUpdate.isActive = updateData.isActive;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return this.findById(id, tx);
        }

        const [updatedTenant] = await tx
            .update(tenants)
            .set(fieldsToUpdate)
            .where(eq(tenants.id, id))
            .returning();

        if (!updatedTenant) return null;

        return this.findById(updatedTenant.id, tx);
    },

    /**
     * Deep-merge or update fields inside the JSONB configuration payload.
     * Uses PostgreSQL jsonb_concat (`||`) operator.
     */
    async updateConfigurationPayload(id, partialConfig, tx = db) {
        const [updatedTenant] = await tx
            .update(tenants)
            .set({
                configurationPayload: sql`${tenants.configurationPayload} || ${JSON.stringify(partialConfig)}::jsonb`,
            })
            .where(eq(tenants.id, id))
            .returning();

        if (!updatedTenant) return null;

        return this.findById(updatedTenant.id, tx);
    },

    /**
     * Update tenant's subscription package tier (lite, growth, enterprise).
     */
    async updatePackageTier(id, packageTier, tx = db) {
        return this.update(id, { packageTier }, tx);
    },

    /**
     * Toggle activation status of a tenant.
     */
    async setActiveStatus(id, isActive, tx = db) {
        return this.update(id, { isActive }, tx);
    },

    /**
     * Permanently delete a tenant record by ID.
     * Note: Triggers cascading deletes for associated user records if FK onDelete is cascade.
     */
    async delete(id, tx = db) {
        const [deleted] = await tx
            .delete(tenants)
            .where(eq(tenants.id, id))
            .returning({ id: tenants.id });

        return !!deleted;
    },

    /**
     * Soft-delete alternative by setting isActive to false.
     */
    async softDelete(id, tx = db) {
        return this.setActiveStatus(id, false, tx);
    },

    /**
     * Count total tenants according to filters.
     */
    async count(filters = {}, tx = db) {
        const conditions = [];

        if (filters.packageTier) conditions.push(eq(tenants.packageTier, filters.packageTier));
        if (typeof filters.isActive === "boolean") conditions.push(eq(tenants.isActive, filters.isActive));

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [{ total }] = await tx
            .select({ total: count() })
            .from(tenants)
            .where(whereClause);

        return Number(total);
    },
};