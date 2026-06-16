import express from "express";

const auth_Router = express.Router();

// controllers
import {
    register_tenant,
    login_tenant,
    logout_tenant
} from "../controllers/auth.Tenant.Controller.js";

auth_Router
    .post("/register", register_tenant)
    .post("/login", login_tenant)
    .post("/logout", logout_tenant);

export default auth_Router;