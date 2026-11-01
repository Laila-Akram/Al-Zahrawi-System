
const SupplyRequest = require("../models/SupplyRequestSchema");

// Get all supply requests with search and filter
const getSupplyRequests = async (req, res) => {
  try {
    const { search, status } = req.query;

    const filter = {};

    // Search by title or description
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Filter by request status
    if (status) {
      const allowedStatuses = ["open", "closed", "completed"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid request status",
        });
      }

      filter.status = status;
    }

    const requests = await SupplyRequest.find(filter)
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
