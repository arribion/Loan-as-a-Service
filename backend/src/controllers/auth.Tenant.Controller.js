import db from "../config/database/db.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} = process.env;

if(!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET || !ACCESS_TOKEN_EXPIRES_IN || !REFRESH_TOKEN_EXPIRES_IN) {
  throw new Error("Missing required environment variables for JWT configuration");
}

const register_tenant = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(401).json({
                success: false,
                message: "all fields are required"
            });
      }
      // check if tenant exist
      await db.query("SELECT * FROM tenants WHERE email = ?", [email], async (err, result) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: "database error",
            error: err
          });
        } else if (result.length > 0) {
          res.status(409).json({
            success: false,
            message: "tenant already exists"
          });
        } else {
          // hash password
          const hashedPassword = await bcrypt.hash(password, 10);
          // insert tenant into database
          await db.query("INSERT INTO tenants (email, password) VALUES (?, ?)", [email, hashedPassword], (err, result) => {
            if (err) {
              res.status(500).json({
                success: false,
                message: "database error",
                error: err
              });
            } else {
              const access_token = jwt.sign(
                { tenant_id: result.insertId },
                ACCESS_TOKEN_SECRET,
                { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
              );

              const refresh_token = jwt.sign(
                { tenant_id: result.insertId },
                REFRESH_TOKEN_SECRET,
                { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
              );

              res.cookie("access_token", access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
              });

              res.cookie("refresh_token", refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
              });

              res.status(201).json({
                success: true,
                message: "tenant registered successfully",
                tenant: {
                  id: result.insertId,
                  email
                } 
              });
            }
          });
        }
      });
    } catch (error) {
         res.status(500).json({
            success: false,
            message: "all fields are required",
            error: error
         });
    }
}

const login_tenant = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email || !password) {
            res.status(401).json({
                success: false,
                message: "all fields are required"
            });
      }
      // check if tenant exist
      await db.query("SELECT * FROM tenants WHERE email = ?", [email], async (err, result) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: "database error",
            error: err
          });
        } else if (result.length === 0) {
          res.status(404).json({
            success: false,
            message: "tenant not found"
          });
        } else {
          const tenant = result[0];
          // verify password
          const isMatch = await bcrypt.compare(password, tenant.password);
          if (!isMatch) {
            res.status(401).json({
              success: false,
              message: "invalid credentials"
            });
          } else {
            // generate tokens
            const access_token = jwt.sign(
              { tenant_id: tenant.id },
              ACCESS_TOKEN_SECRET,
              { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
            );

            const refresh_token = jwt.sign(
              { tenant_id: tenant.id },
              REFRESH_TOKEN_SECRET,
              { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
            );

            res.cookie("access_token", access_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
            });

            res.cookie("refresh_token", refresh_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
            });

            res.status(200).json({
              success: true,
              message: "tenant logged in successfully",
              tenant: {
                id: tenant.id,
                email: tenant.email
              }
            });
          }
        }
      });
    } catch (error) {
         res.status(500).json({
           success: false,
           message: "all fields are required",
           error: error
         });
    }
}

const refresh_token = async (req, res) => {
      
}

const logout_tenant = (req, res) => {
  try {
    
  } catch (error) {
     res.status(500).json({
       success: false,
       message: "all fields are required",
       error,
     });
  }
}

export default {
    register_tenant,
    login_tenant,
    refresh_token,
    logout_tenant
}