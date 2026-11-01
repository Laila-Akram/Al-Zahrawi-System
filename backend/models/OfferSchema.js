
const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    supplyRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupplyRequest",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    details: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
