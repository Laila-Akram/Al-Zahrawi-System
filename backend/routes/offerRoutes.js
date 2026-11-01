const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getOffers,
  createOffer,
} = require("../controllers/offerController");

// Get all offers
router.get(
  "/",
  protect,
  authorize("doctor", "supplier"),
  getOffers
);

// Create an offer
router.post(
  "/",
  protect,
  authorize("supplier"),
  createOffer
);

module.exports = router;