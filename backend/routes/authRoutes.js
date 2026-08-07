const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
  verifyOTP,
  resendOTP,
} = require("../controllers/authController");
const { getAllUsers, toggleUserActive } = require("../controllers/adminController");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", loginUser);

router.get("/profile", protect, getProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Admin only
router.get("/admin/users", protect, adminOnly, getAllUsers);
router.patch("/admin/users/:id/toggle-active", protect, adminOnly, toggleUserActive);

module.exports = router;