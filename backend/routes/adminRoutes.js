
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getPendingUsers,
  approveUser,
  rejectUser,
} = require("../controllers/adminController");

// Get pending users
router.get("/pending-users", protect, authorize("admin"), getPendingUsers);

// Approve user
router.patch("/approve/:id", protect, authorize("admin"), approveUser);

// Reject user
router.patch("/reject/:id", protect, authorize("admin"), rejectUser);

module.exports = router;
