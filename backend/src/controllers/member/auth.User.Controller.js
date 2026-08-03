import db from "../../config/database/db.js";
import users, { users } from "../../config/database/schemas/index.js/users.js"
import bcrypt from "bcrypt";

const member_login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required"
      });
    }
    // check if the user exists in the database
    const user = await db.select("*").from("users").where({ email }).returning("*").first();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }
    // generate a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

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
    const [users] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.users_id))
      .limit(1);
    if (!users) {
      return res
        .status(404)
        .json({ success: false, message: "User no longer exists" });
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


export const logout_member = (req, res) => {
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
