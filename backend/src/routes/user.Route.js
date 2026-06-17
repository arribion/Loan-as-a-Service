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
userRoute
    // .route("/:member_id" )
    .post(add_member)
    .get(get_member)
    .get(get_member)
    .put(update_member)
    .delete(delete_member);

export default userRoute;