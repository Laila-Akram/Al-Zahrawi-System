
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// Get all categories
router.get("/", protect, authorize("admin"), getCategories);

// Create a category
router.post("/", protect, authorize("admin"), createCategory);

// Update a category
router.patch("/:id", protect, authorize("admin"), updateCategory);

// Delete a category
router.delete("/:id", protect, authorize("admin"), deleteCategory);

module.exports = router;
