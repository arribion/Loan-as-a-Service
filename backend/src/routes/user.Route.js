import express from "express";
const userRoute = express.Router();

// controllers
import {
    add_member,
    update_member,
    delete_member,
    get_member,
    get_all_members,
    generate_member_credentials
} from "../controllers/tenant/tenant.Memeber.Manage.Controller.js";

// routes
userRoute.route("/:tenant_id/members", generate_member_credentials);
// /:member_id
userRoute
    .post("/add", add_member)
    .put("/update", update_member)
    .get("/get", get_member)
    .delete("/delete", delete_member);

export default userRoute;