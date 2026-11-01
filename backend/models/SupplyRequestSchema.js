
const mongoose = require("mongoose");

const supplyRequestSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["open", "closed", "completed"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupplyRequest", supplyRequestSchema);
