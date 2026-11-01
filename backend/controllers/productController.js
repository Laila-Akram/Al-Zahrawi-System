const Product = require("../models/ProductSchema");
const Category = require("../models/CategorySchema");

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create a product
const createProduct = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !name.trim() || !category) {
      return res.status(400).json({
        message: "Please provide product name and category",
      });
    }

    const existingCategory = await Category.findOne({
      _id: category,
      status: "active",
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Active category not found",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      category,
    });

    await product.populate("category", "name");

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !name.trim() || !category) {
      return res.status(400).json({
        message: "Please provide product name and category",
      });
    }

    const existingCategory = await Category.findOne({
      _id: category,
      status: "active",
    });

    if (!existingCategory) {
      return res.status(404).json({
        message: "Active category not found",
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        category,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};