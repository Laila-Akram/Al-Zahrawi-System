const Review = require("../models/ReviewSchema");
const Offer = require("../models/OfferSchema");

// Create a review
const createReview = async (req, res) => {
  try {
    const { offerId, rating, comment } = req.body;

    if (!offerId || rating === undefined) {
      return res.status(400).json({
        message: "Please provide offer ID and rating",
      });
    }

    if (
      !Number.isInteger(Number(rating)) ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(404).json({
        message: "Offer not found",
      });
    }

    if (offer.status !== "accepted") {
      return res.status(400).json({
        message: "You can only review an accepted offer",
      });
    }

    if (offer.supplier.toString() === req.user.id) {
      return res.status(403).json({
        message: "You cannot review your own offer",
      });
    }

    const existingReview = await Review.findOne({
      doctor: req.user.id,
      supplier: offer.supplier,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this supplier",
      });
    }

    const review = await Review.create({
      doctor: req.user.id,
      supplier: offer.supplier,
      rating: Number(rating),
      comment,
    });

    res.status(201).json({
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get supplier reviews
const getSupplierReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      supplier: req.params.supplierId,
    })
      .populate("doctor", "name")
      .populate("supplier", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createReview,
  getSupplierReviews,
};