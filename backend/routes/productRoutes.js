const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Get all products
router.get("/", protect, authorize("admin"), getProducts);

// Create a product
router.post("/", protect, authorize("admin"), createProduct);

// Update a product
router.patch("/:id", protect, authorize("admin"), updateProduct);

// Delete a product
router.delete("/:id", protect, authorize("admin"), deleteProduct);

module.exports = router;