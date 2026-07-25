// controllers/auth.controller.js
import { db } from "../config/database/db.js";
import { users } from "../config/database/schemas/users.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = process.env;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

// --------------------------------------------------
// 1. Tenant Registration (creates tenant + admin user)
// --------------------------------------------------
export const registerTenant = async (req, res) => {
  const { businessName, email, password } = req.body;
  try {
    // Validate required fields
    if (!businessName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if a user with this email already exists (globally unique)
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email_address, email))
      .limit(1);

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Start a transaction (important)
    const result = await db.transaction(async (trx) => {
      // 1. Create the tenant
      const [newTenant] = await trx
        .insert(tenants)
        .values({
          business_name: businessName,
          package_tier: "lite", // default
          is_active: true,
        })
        .returning();

      // 2. Create the admin user (linked to this tenant)
      const hashedPassword = await bcrypt.hash(password, 10);
      const [newAdmin] = await trx
        .insert(users)
        .values({
          tenant_id: newTenant.id,
          full_name: "Administrator",
          email_address: email,
          password_hash: hashedPassword,
          security_role: "admin",
          tracking_status: "active",
        })
        .returning();

      return { tenant: newTenant, admin: newAdmin };
    });

    // 3. Generate JWT for the admin
    const access_token = jwt.sign(
      { userId: result.admin.id, tenantId: result.tenant.id, role: "admin" },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );
    const refresh_token = jwt.sign(
      { userId: result.admin.id, tenantId: result.tenant.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
    );

    res.cookie("access_token", access_token, cookieOptions);
    res.cookie("refresh_token", refresh_token, cookieOptions);

    return res.status(201).json({
      message: "Tenant registered successfully",
      tenant: { id: result.tenant.id, name: result.tenant.business_name },
      admin: { id: result.admin.id, email: result.admin.email_address },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------------------------------------
// 2. User Login (any user: admin, officer, borrower)
// --------------------------------------------------
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 1. Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email_address, email))
      .limit(1);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Fetch the tenant to ensure it's active
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, user.tenant_id))
      .limit(1);

    if (!tenant || !tenant.is_active) {
      return res
        .status(403)
        .json({ message: "Tenant is inactive or disabled" });
    }

    // 4. Generate tokens
    const access_token = jwt.sign(
      { userId: user.id, tenantId: user.tenant_id, role: user.security_role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );
    const refresh_token = jwt.sign(
      { userId: user.id, tenantId: user.tenant_id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
    );

    res.cookie("access_token", access_token, cookieOptions);
    res.cookie("refresh_token", refresh_token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email_address,
        role: user.security_role,
        tenantId: user.tenant_id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------------------------------------
// 3. Refresh Token
// --------------------------------------------------
export const refreshToken = async (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, tenantId: user.tenant_id, role: user.security_role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );

    res.cookie("access_token", newAccessToken, cookieOptions);
    return res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

// --------------------------------------------------
// 4. Logout
// --------------------------------------------------
export const logoutUser = (req, res) => {
  res.clearCookie("access_token", cookieOptions);
  res.clearCookie("refresh_token", cookieOptions);
  return res.status(200).json({ message: "Logged out successfully" });
};
