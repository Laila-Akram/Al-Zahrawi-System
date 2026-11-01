const SupplyRequest = require("../models/SupplyRequestSchema");

// Get all supply requests
const getSupplyRequests = async (req, res) => {
  try {
    const requests = await SupplyRequest.find()
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create a supply request
const createSupplyRequest = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Please provide a request title",
      });
    }

    const request = await SupplyRequest.create({
      doctor: req.user.id,
      title: title.trim(),
      description,
    });

    res.status(201).json({
      message: "Supply request created successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSupplyRequests,
  createSupplyRequest,
};