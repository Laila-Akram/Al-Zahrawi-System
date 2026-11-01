
const User = require("../models/UserSchema");

// Register a new user
const registerUser = async (req, res) => {
  try {
    res.status(201).json({
      message: "Register controller is working",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    res.status(200).json({
      message: "Login controller is working",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
