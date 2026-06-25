import express from "express";
const memberRoute = express.Router();

import {
  add_member,
  update_member,
  delete_member,
  get_member,
  get_all_members
} from "../controllers/tenant/memeber.Controller.js";

// Rejects the request if member_id is missing or invalid
const validateMemberId = (req, res, next) => {
  const { member_id } = req.params;

  if (!member_id || member_id.trim() === "" || member_id === ":member_id") {
    return res.status(400).json({
      success: false,
      error:
        "Bad Request: An operational 'member_id' parameter is strictly required to modify this resource.",
    });
  }
  next();
};

// routes
memberRoute
  .post("/:tenant_id/add", add_member)
  .get("/:tenant_id/get/:member_id", validateMemberId, get_member)
  .get("/:tenant_id/", get_all_members)
  .put("/:tenant_id/update/:member_id", validateMemberId, update_member)
  .delete("/:tenant_id/delete/:member_id", validateMemberId, delete_member);

export default memberRoute;
