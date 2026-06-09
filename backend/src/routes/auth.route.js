import express from "express";

const authRouter = express.Router();

// controllers
import {
    register_tenant,
    login_tenant,
    logout_tenant
} from "../controllers/auth.controller.js"

authRouter
    .post("register", register_tenant)
    .post("/login", login_tenant)
    .post("/logout", logout_tenant);

export default authRouter;