const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getSupplyRequests,
  createSupplyRequest,
} = require("../controllers/supplyRequestController");

// Get all supply requests
router.get(
  "/",
  protect,
  authorize("doctor", "supplier"),
  getSupplyRequests
);

// Create a supply request
router.post(
  "/",
  protect,
  authorize("doctor"),
  createSupplyRequest
);

module.exports = router;