
const User = require("../models/UserSchema");

// Get accounts waiting for approval
const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["doctor", "supplier"] },
      isApproved: false,
      isRejected: false,
    }).select("-password");

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

// Get all doctors and suppliers with search and filters
const getAllUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;

    const filter = {
      role: { $in: ["doctor", "supplier"] },
    };

    // Search by name or email
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // Filter by role
    if (role) {
      if (!["doctor", "supplier"].includes(role)) {
        return res.status(400).json({
          message: "Invalid user role",
        });
      }

      filter.role = role;
    }

    // Filter by account status
    if (status) {
      switch (status) {
        case "pending":
          filter.isApproved = false;
          filter.isRejected = false;
          break;

        case "approved":
          filter.isApproved = true;
          filter.isRejected = false;
          break;

        case "rejected":
          filter.isRejected = true;
          break;

        case "active":
          filter.isActive = true;
          break;

        case "inactive":
          filter.isActive = false;
          break;

        default:
          return res.status(400).json({
            message: "Invalid user status",
          });
      }
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Activate or deactivate a user
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "Please provide isActive as true or false",
      });
    }

    const user = await User.findOne({
      _id: req.params.id,
      role: { $in: ["doctor", "supplier"] },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPendingUsers,
  approveUser,
  rejectUser,
  getAllUsers,
  updateUserStatus,
};
