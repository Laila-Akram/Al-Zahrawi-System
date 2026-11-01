const Offer = require("../models/OfferSchema");
const SupplyRequest = require("../models/SupplyRequestSchema");

// Get offers based on user role
const getOffers = async (req, res) => {
  try {
    let offers;

    if (req.user.role === "supplier") {
      // Supplier sees only their own offers
      offers = await Offer.find({
        supplier: req.user.id,
      });
    } else if (req.user.role === "doctor") {
      // Doctor sees offers on their own requests
      const requests = await SupplyRequest.find({
        doctor: req.user.id,
      }).select("_id");

      const requestIds = requests.map((request) => request._id);

      offers = await Offer.find({
        supplyRequest: { $in: requestIds },
      });
    }

    offers = await Offer.populate(offers, [
      { path: "supplier", select: "name email" },
      { path: "supplyRequest", select: "title description" },
    ]);

    offers.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({
      count: offers.length,
      offers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create an offer
const createOffer = async (req, res) => {
  try {
    const { supplyRequest, price, details } = req.body;

    if (!supplyRequest || price === undefined || price === null || price === "") {
      return res.status(400).json({
        message: "Please provide supply request and price",
      });
    }

    if (Number(price) < 0 || !Number.isFinite(Number(price))) {
      return res.status(400).json({
        message: "Price must be a valid positive number",
      });
    }

    const existingRequest = await SupplyRequest.findById(supplyRequest);

    if (!existingRequest) {
      return res.status(404).json({
        message: "Supply request not found",
      });
    }

    if (existingRequest.status !== "open") {
      return res.status(400).json({
        message: "This supply request is not open",
      });
    }

    const offer = await Offer.create({
      supplier: req.user.id,
      supplyRequest,
      price: Number(price),
      details,
    });

    await offer.populate("supplier", "name email");
    await offer.populate("supplyRequest", "title description");

    res.status(201).json({
      message: "Offer submitted successfully",
      offer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getOffers,
  createOffer,
};