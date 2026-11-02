
const Product = require("../models/ProductSchema");
const Category = require("../models/CategorySchema");

// Get all products with search and filters
const getProducts = async (req, res) => {
  try {
    const { search, category, status } = req.query;

    const filter = {};

    if (search && search.trim()) {
      filter.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      const allowedStatuses = ["active", "inactive"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid product status",
        });
      }

      filter.status = status;
    }

    const products = await Product.find(filter)
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
    const { name, category, price } = req.body;

    if (
      !name ||
      !name.trim() ||
      !category ||
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return res.status(400).json({
        message: "Please provide product name, category, and price",
      });
    }

    const productPrice = Number(price);

    if (!Number.isFinite(productPrice) || productPrice < 0) {
      return res.status(400).json({
        message: "Price must be a valid non-negative number",
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
      price: productPrice,
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
    const { name, category, price } = req.body;

    if (
      !name ||
      !name.trim() ||
      !category ||
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return res.status(400).json({
        message: "Please provide product name, category, and price",
      });
    }

    const productPrice = Number(price);

    if (!Number.isFinite(productPrice) || productPrice < 0) {
      return res.status(400).json({
        message: "Price must be a valid non-negative number",
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
        price: productPrice,
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
