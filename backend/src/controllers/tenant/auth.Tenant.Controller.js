import { db } from "../../config/database/db.js";
import { tenants } from "../../config/database/schema.js"; // Ensure path to your schema is correct
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = process.env;

if (
  !ACCESS_TOKEN_SECRET ||
  !REFRESH_TOKEN_SECRET ||
  !ACCESS_TOKEN_EXPIRES_IN ||
  !REFRESH_TOKEN_EXPIRES_IN
) {
  throw new Error(
    "Missing required environment variables for JWT configuration",
  );
}

// Helper function to handle cookie configurations consistently
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

// tenant registration function
export const register_tenant = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });
    }

    // 1. Check if tenant exists using Drizzle relational API or builder
    const existingTenant = await db
      .select()
      .from(tenants)
      .where(eq(tenants.email, email))
      .limit(1);

    if (existingTenant.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "tenant already exists" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert tenant and return the row 
    const [newTenant] = await db
      .insert(tenants)
      .values({ email, password: hashedPassword })
      .returning();

    // 4. Generate JWT tokens
    const access_token = jwt.sign(
      { tenant_id: newTenant.id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );
    const refresh_token = jwt.sign(
      { tenant_id: newTenant.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
    );

    // 5. Send cookies and response
    res.cookie("access_token", access_token, cookieOptions);
    res.cookie("refresh_token", refresh_token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "tenant registered successfully",
      tenant: { id: newTenant.id, email: newTenant.email },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error.message });
  }
};

// tenant login function
export const login_tenant = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });
    }

    // 1. Find tenant by email
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.email, email))
      .limit(1);

    if (!tenant) {
      return res
        .status(404)
        .json({ success: false, message: "tenant not found" });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, tenant.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "invalid credentials" });
    }

    // 3. Generate tokens
    const access_token = jwt.sign(
      { tenant_id: tenant.id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );
    const refresh_token = jwt.sign(
      { tenant_id: tenant.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
    );

    // 4. Send cookies and response
    res.cookie("access_token", access_token, cookieOptions);
    res.cookie("refresh_token", refresh_token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "tenant logged in successfully",
      tenant: { id: tenant.id, email: tenant.email },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error.message });
  }
};

export const refresh_token = async (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Access denied, no refresh token provided",
      });
  }

  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);

    // Check if tenant still exists in database
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, decoded.tenant_id))
      .limit(1);
    if (!tenant) {
      return res
        .status(404)
        .json({ success: false, message: "Tenant no longer exists" });
    }

    const new_access_token = jwt.sign(
      { tenant_id: tenant.id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );

    res.cookie("access_token", new_access_token, cookieOptions);
    return res
      .status(200)
      .json({ success: true, message: "token refreshed successfully" });
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};

export const logout_tenant = (req, res) => {
  try {
    res.clearCookie("access_token", cookieOptions);
    res.clearCookie("refresh_token", cookieOptions);
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error.message });
  }
};

export default {
  register_tenant,
  login_tenant,
  refresh_token,
  logout_tenant,
};
