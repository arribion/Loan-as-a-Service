import db from "../config/database/db.js";
import { users, tenants } from "../config/database/schemas/index.js";
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

// Validate email format
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
// Validate Kenyan phone (optional)
const isValidPhone = (phone) =>
  /^\+?254\d{9}$|^0\d{9}$/.test(phone.replace(/\s/g, ""));


// 1. Tenant Registration (with transaction)
export const registerTenant = async (req, res) => {
  const { businessName, fullName, email, phone, password, plan } = req.body;

  // Validate required fields
  if (!businessName || !fullName || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  // Phone is optional, but if provided, validate it
  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }
  if (!["lite", "growth", "enterprise"].includes(plan)) {
    return res.status(400).json({ message: "Invalid plan" });
  }

  try {
    // Check if email already registered
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email_address, email))
      .limit(1);
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Use transaction for atomic creation
    const result = await db.transaction(async (trx) => {
      // 1. Create tenant
      const [newTenant] = await trx
        .insert(tenants)
        .values({
          business_name: businessName,
          package_tier: plan,
          configuration_payload: {},
          is_active: true,
        })
        .returning();

      // 2. Create admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      const [newAdmin] = await trx
        .insert(users)
        .values({
          tenant_id: newTenant.id,
          full_name: fullName,
          email_address: email,
          password_hash: hashedPassword,
          phone_number: phone || null,
          security_role: "admin",
          tracking_status: "active",
        })
        .returning();

      return { tenant: newTenant, admin: newAdmin };
    });

    // Generate JWT tokens
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



//  User Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email_address, email))
      .limit(1);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

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
      tenant: {
        id: tenant.id,
        businessName: tenant.business_name,
        packageTier: tenant.package_tier,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



//  Get Current User (session restoration)
export const getMe = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, user.tenant_id))
      .limit(1);

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    return res.json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email_address,
        role: user.security_role,
        tenantId: user.tenant_id,
      },
      tenant: {
        id: tenant.id,
        businessName: tenant.business_name,
        packageTier: tenant.package_tier,
        isActive: tenant.is_active,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



//  Refresh Token
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


//  Logout
export const logoutUser = (req, res) => {
  res.clearCookie("access_token", cookieOptions);
  res.clearCookie("refresh_token", cookieOptions);
  return res.status(200).json({ message: "Logged out successfully" });
};


export default {
  registerTenant,
  loginUser,
  getMe,
  refreshToken,
  logoutUser,
};