const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  googleLogin,
  updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Google Login
router.post("/google", googleLogin);

// Update profile
router.put("/profile", protect, updateProfile);

module.exports = router;