export const enforceTierLimits = async (req, res, next) => {
  try {
    const enterpriseId = req.user.enterpriseId; // Extracted from your auth token
    const { role } = req.body; // The role of the new user being created (e.g., 'admin' or 'user')

    // 1. Fetch the Enterprise details and their current usage counts
    const enterprise = await Enterprise.findById(enterpriseId);
    const plan = TIER_LIMITS[enterprise.subscriptionTier];

    if (!plan) {
      return res.status(400).json({ error: "Invalid subscription tier" });
    }

    // 2. Query database for current counts
    const currentTotalUsers = await User.countDocuments({
      enterpriseId: enterpriseId,
    });
    const currentTotalAdmins = await User.countDocuments({
      enterpriseId: enterpriseId,
      role: "admin",
    });

    // 3. Enforce the constraints
    if (role === "admin" && currentTotalAdmins >= plan.maxAdmins) {
      return res
        .status(403)
        .json({ error: "Admin limit reached for your subscription tier" });
    }

    if (currentTotalUsers >= plan.maxUsers) {
      return res
        .status(403)
        .json({ error: "User limit reached for your subscription tier" });
    }

    // Proceed if limits are not exceeded
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error during limit check" });
  }
};

export default enforceTierLimits;

// EXAMPLE USAGE
// ==========================
// const express = require("express");
// const router = express.Router();
// const { authenticateToken } = require("./authMiddleware"); // Your standard auth middleware

// // Apply authentication first, then your tier enforcement middleware
// router.post(
//   "/users/invite",
//   authenticateToken,
//   enforceTierLimits,
//   async (req, res) => {
//     // Logic to create the user goes here
//     res.status(201).json({ message: "User created successfully" });
//   },
// );

// export default router;
