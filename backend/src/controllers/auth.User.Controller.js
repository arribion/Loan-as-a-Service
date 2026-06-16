import db from "../config/database/db.js";
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
        const user = await db.select("*").from("users").where({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
 }
const refresh_token = async (req, res) => { }
const logout_member = async (req, res) => { }