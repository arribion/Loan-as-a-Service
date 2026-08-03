import { eq, and, or, ilike, sql, desc, asc, count } from "drizzle-orm";
import { users, tenants } from "../config/database/schemas/index.js";
import db from "../config/database/db.js";

/**
 * Standard user selection fields (omitting sensitive fields like password_hash).
 */
const selectFields = {
    id: users.id,
    tenantId: users.tenantId,
    fullName: users.fullName,
    emailAddress: users.emailAddress,
    phoneNumber: users.phoneNumber,
    securityRole: users.securityRole,
    trackingStatus: users.trackingStatus,
    createdAt: users.createdAt,
    tenantName: tenants.businessName, // Joined field
};

/**
 * Helper to get base query with standard relations.
 * Accepts either standard db instance or a transaction instance (tx).
 */
function getBaseUserQuery(executor = db) {
    return executor
        .select(selectFields)
        .from(users)
        .leftJoin(tenants, eq(users.tenantId, tenants.id));
}

export const UserRepository = {
    /**
     * Find a user by ID.
     */
    async findById(id, tenantId = null, tx = db) {
        const conditions = [eq(users.id, id)];
        if (tenantId) conditions.push(eq(users.tenantId, tenantId));

        const [user] = await getBaseUserQuery(tx).where(and(...conditions));
        return user || null;
    },

    /**
     * Find a user by Email address.
     */
    async findByEmail(emailAddress, tenantId = null, tx = db) {
        const conditions = [eq(users.emailAddress, emailAddress.toLowerCase())];
        if (tenantId) conditions.push(eq(users.tenantId, tenantId));

        const [user] = await getBaseUserQuery(tx).where(and(...conditions));
        return user || null;
    },

    /**
     * Find a user by Email INCLUDING password hash (used for authentication flow).
     */
    async findByEmailWithPassword(emailAddress, tx = db) {
        const [user] = await tx
            .select({
                ...selectFields,
                passwordHash: users.password_hash,
            })
            .from(users)
            .leftJoin(tenants, eq(users.tenantId, tenants.id))
            .where(eq(users.emailAddress, emailAddress.toLowerCase()));

        return user || null;
    },

    /**
     * Check if an email is already registered.
     */
    async existsByEmail(emailAddress, tx = db) {
        const [{ count: result }] = await tx
            .select({ count: count() })
            .from(users)
            .where(eq(users.emailAddress, emailAddress.toLowerCase()));

        return Number(result) > 0;
    },

    /**
     * List users with filtering, sorting, search, and pagination.
     */
    async findAll(options = {}, tx = db) {
        const {
            tenantId,
            securityRole,
            trackingStatus,
            search,
            page = 1,
            limit = 20,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = options;

        const conditions = [];

        if (tenantId) conditions.push(eq(users.tenantId, tenantId));
        if (securityRole) conditions.push(eq(users.securityRole, securityRole));
        if (trackingStatus) conditions.push(eq(users.trackingStatus, trackingStatus));

        if (search) {
            conditions.push(
                or(
                    ilike(users.fullName, `%${search}%`),
                    ilike(users.emailAddress, `%${search}%`),
                    ilike(users.phoneNumber, `%${search}%`)
                )
            );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        const offset = (page - 1) * limit;

        // Resolve dynamic column ordering
        const sortColumn = users[sortBy] || users.createdAt;
        const orderSpec = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

        const [data, [{ total }]] = await Promise.all([
            getBaseUserQuery(tx)
                .where(whereClause)
                .orderBy(orderSpec)
                .limit(limit)
                .offset(offset),
            tx
                .select({ total: count() })
                .from(users)
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
     * Get all users under a specific tenant.
     */
    async findAllByTenant(tenantId, options = {}, tx = db) {
        return this.findAll({ ...options, tenantId }, tx);
    },

    /**
     * Create a single user.
     */
    async create(userData, tx = db) {
        const [newUser] = await tx
            .insert(users)
            .values({
                tenantId: userData.tenantId,
                fullName: userData.fullName,
                emailAddress: userData.emailAddress.toLowerCase(),
                password_hash: userData.passwordHash,
                phoneNumber: userData.phoneNumber || null,
                securityRole: userData.securityRole || "borrower",
                trackingStatus: userData.trackingStatus || "active",
            })
            .returning();

        return this.findById(newUser.id, null, tx);
    },

    /**
     * Bulk insert multiple users.
     */
    async bulkCreate(usersList, tx = db) {
        const formattedData = usersList.map((u) => ({
            tenantId: u.tenantId,
            fullName: u.fullName,
            emailAddress: u.emailAddress.toLowerCase(),
            password_hash: u.passwordHash,
            phoneNumber: u.phoneNumber || null,
            securityRole: u.securityRole || "borrower",
            trackingStatus: u.trackingStatus || "active",
        }));

        return tx.insert(users).values(formattedData).returning();
    },

    /**
     * Update user details dynamically.
     */
    async update(id, updateData, tenantId = null, tx = db) {
        const conditions = [eq(users.id, id)];
        if (tenantId) conditions.push(eq(users.tenantId, tenantId));

        const fieldsToUpdate = {};
        if (updateData.fullName !== undefined) fieldsToUpdate.fullName = updateData.fullName;
        if (updateData.emailAddress !== undefined) fieldsToUpdate.emailAddress = updateData.emailAddress.toLowerCase();
        if (updateData.passwordHash !== undefined) fieldsToUpdate.password_hash = updateData.passwordHash;
        if (updateData.phoneNumber !== undefined) fieldsToUpdate.phoneNumber = updateData.phoneNumber;
        if (updateData.securityRole !== undefined) fieldsToUpdate.securityRole = updateData.securityRole;
        if (updateData.trackingStatus !== undefined) fieldsToUpdate.trackingStatus = updateData.trackingStatus;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return this.findById(id, tenantId, tx);
        }

        const [updatedUser] = await tx
            .update(users)
            .set(fieldsToUpdate)
            .where(and(...conditions))
            .returning();

        if (!updatedUser) return null;

        return this.findById(updatedUser.id, tenantId, tx);
    },

    /**
     * Update tracking status (e.g., active, suspended, pending_kyc).
     */
    async updateStatus(id, trackingStatus, tenantId = null, tx = db) {
        return this.update(id, { trackingStatus }, tenantId, tx);
    },

    /**
     * Update security role (e.g., admin, loan_officer, borrower).
     */
    async updateRole(id, securityRole, tenantId = null, tx = db) {
        return this.update(id, { securityRole }, tenantId, tx);
    },

    /**
     * Delete a user by ID.
     */
    async delete(id, tenantId = null, tx = db) {
        const conditions = [eq(users.id, id)];
        if (tenantId) conditions.push(eq(users.tenantId, tenantId));

        const [deleted] = await tx
            .delete(users)
            .where(and(...conditions))
            .returning({ id: users.id });

        return !!deleted;
    },

    /**
     * Soft-delete user alternative by setting tracking status to 'suspended'.
     */
    async softDelete(id, tenantId = null, tx = db) {
        return this.updateStatus(id, "suspended", tenantId, tx);
    },
    /**
    * Soft-delete user alternative by setting tracking status to 'suspended'.
    */
    async suspend(id, tenantId = null, tx = db) {
        return this.updateStatus(id, "suspended", tenantId, tx);
    },

    /**
     * Count total users by criteria.
     */
    async count(filters = {}, tx = db) {
        const conditions = [];
        if (filters.tenantId) conditions.push(eq(users.tenantId, filters.tenantId));
        if (filters.securityRole) conditions.push(eq(users.securityRole, filters.securityRole));
        if (filters.trackingStatus) conditions.push(eq(users.trackingStatus, filters.trackingStatus));

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const [{ total }] = await tx
            .select({ total: count() })
            .from(users)
            .where(whereClause);

        return Number(total);
    },
};