import express from "express";
import {
    registration_validator,
    login_validator
} from "../middlewares/auth.Validator.js"
const auth_Router = express.Router();

// controllers
import {
    register_tenant,
    login_tenant,
    logout_tenant
} from "../controllers/tenant/auth.Tenant.Controller.js";

auth_Router
    .post("/register", register_tenant)
    .post("/login",login_validator, login_tenant)
    .post("/logout", logout_tenant);

export default auth_Router;