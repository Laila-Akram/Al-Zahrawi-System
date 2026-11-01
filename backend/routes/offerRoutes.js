
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getOffers,
  createOffer,
  acceptOffer,
} = require("../controllers/offerController");

// Get offers
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

// Accept an offer
router.patch(
  "/:id/accept",
  protect,
  authorize("doctor"),
  acceptOffer
);

module.exports = router;
