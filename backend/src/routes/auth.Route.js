import express from "express";
const auth_router = express.Router();

import {
  registerTenant,
  loginUser,
  refreshToken,
  logoutUser,
} from "../controllers/auth.Controller.js";

auth_router.post("/register", registerTenant);
auth_router.post("/login", loginUser);
auth_router.post("/refresh", refreshToken);
auth_router.post("/logout", authenticate, logoutUser);

// routes/members.routes.js (tenant admin only)
import { authenticate, requireRole } from "../middlewares/auth.js";
import {
  add_member,
  update_member,
  delete_member,
  get_all_members,
} from "../controllers/tenant/memeber.Controller.js";

auth_router.use(authenticate);
auth_router.use(requireRole(["admin", "loan_officer"])); // only staff can manage members

auth_router.get("/", get_all_members);
auth_router.post("/", add_member);
auth_router.put("/:member_id", update_member);
auth_router.delete("/:member_id", delete_member);
// ...


export default auth_router;