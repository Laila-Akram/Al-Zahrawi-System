
const User = require("../models/UserSchema");

// Get accounts waiting for approval
const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["doctor", "supplier"] },
      isApproved: false,
      isRejected: false,
    }).select("-password");

    res.status(200).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Approve a user
const approveUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: { $in: ["doctor", "supplier"] },
      isApproved: false,
      isRejected: false,
    });

    if (!user) {
      return res.status(404).json({
        message: "Pending user not found",
      });
    }

    user.isApproved = true;

    await user.save();

    res.status(200).json({
      message: "User approved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Reject a user
const rejectUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      role: { $in: ["doctor", "supplier"] },
      isApproved: false,
      isRejected: false,
    });

    if (!user) {
      return res.status(404).json({
        message: "Pending user not found",
      });
    }

    user.isRejected = true;

    await user.save();

    res.status(200).json({
      message: "User rejected successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getPendingUsers,
  approveUser,
  rejectUser,
};
