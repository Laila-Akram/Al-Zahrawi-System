const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  createReview,
  getSupplierReviews,
} = require("../controllers/reviewController");

// Create a review
router.post(
  "/",
  protect,
  authorize("doctor"),
  createReview
);

// Get supplier reviews
router.get(
  "/supplier/:supplierId",
  protect,
  authorize("doctor", "supplier", "admin"),
  getSupplierReviews
);

module.exports = router;