import express from "express";
const auth_router = express.Router();

// authentication middleware
import { authenticate, requireRole } from "../middlewares/auth.js";

// controllers
import {
  registerTenant,
  loginUser,
  refreshToken,
  logoutUser,
  getMe,
} from "../controllers/auth.Controller.js";


import {
  add_member,
  update_member,
  delete_member,
  get_all_members,
} from "../controllers/tenant/memeber.Controller.js";

//  Public routes
auth_router.post("/register", registerTenant);
auth_router.post("/login", loginUser);
auth_router.post("/refresh", refreshToken);

//  Protected routes 
auth_router.get("/me", authenticate, getMe);
auth_router.post("/logout", authenticate, logoutUser);

// ----- Member management (admin + loan_officer only) -----
// These are under the same router, but you could separate them into a dedicated router.
// They use the same base path: /api/v1/auth/...
// To avoid conflicts, you might want to move them to a separate router (e.g., /api/v1/members)
// but for simplicity we keep them here.

// Apply authentication and role check to all member routes
auth_router.use(authenticate);
auth_router.use(requireRole(["admin", "loan_officer"]));

auth_router.get("/members", get_all_members); // GET /api/v1/auth/members
auth_router.post("/members", add_member); // POST /api/v1/auth/members
auth_router.put("/members/:member_id", update_member);
auth_router.delete("/members/:member_id", delete_member);

export default auth_router;