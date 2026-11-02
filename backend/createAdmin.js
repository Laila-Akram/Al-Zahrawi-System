
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/UserSchema");

const createAdmin = async () => {
  try {
    await connectDB();

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Admin environment variables are missing.");
    }

    const email = ADMIN_EMAIL.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const admin = await User.findOne({ email });

    if (admin) {
      admin.name = ADMIN_NAME;
      admin.password = hashedPassword;
      admin.role = "admin";
      admin.isApproved = true;
      admin.isRejected = false;
      admin.isActive = true;

      await admin.save();

      console.log("Admin account updated successfully.");
    } else {
      await User.create({
        name: ADMIN_NAME,
        email,
        password: hashedPassword,
        role: "admin",
        isApproved: true,
        isRejected: false,
        isActive: true,
      });

      console.log("Admin account created successfully.");
    }
  } catch (error) {
    console.error("Admin setup failed:", error.message);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();
