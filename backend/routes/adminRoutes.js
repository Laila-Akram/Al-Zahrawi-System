
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getPendingUsers,
  approveUser,
  rejectUser,
  getAllUsers,
  updateUserStatus,
} = require("../controllers/adminController");

// Get pending users
router.get("/pending-users", protect, authorize("admin"), getPendingUsers);

// Get all users
router.get("/users", protect, authorize("admin"), getAllUsers);

// Approve user
router.patch("/approve/:id", protect, authorize("admin"), approveUser);

// Reject user
router.patch("/reject/:id", protect, authorize("admin"), rejectUser);

// Activate or deactivate user
router.patch("/users/:id/status", protect, authorize("admin"), updateUserStatus);

module.exports = router;
