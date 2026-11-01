
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const protect = require("./middleware/authMiddleware");
const authorize = require("./middleware/roleMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("AL-ZAHRAWI API is running!");
});

// Doctor test route
app.get("/api/test/doctor", protect, authorize("doctor"), (req, res) => {
  res.status(200).json({
    message: "Doctor access granted",
  });
});

// Supplier test route
app.get("/api/test/supplier", protect, authorize("supplier"), (req, res) => {
  res.status(200).json({
    message: "Supplier access granted",
  });
});

// Admin test route
app.get("/api/test/admin", protect, authorize("admin"), (req, res) => {
  res.status(200).json({
    message: "Admin access granted",
  });
});

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
