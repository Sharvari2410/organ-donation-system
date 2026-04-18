// Express app setup
const express = require("express");
const cors = require("cors");
const donorRoutes = require("./routes/donorRoutes");
const recipientRoutes = require("./routes/recipientRoutes");
const matchRoutes = require("./routes/matchRoutes");
const matchRequestRoutes = require("./routes/matchRequestRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Organ Donation API is running" });
});

// Donor API routes
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/recipients", recipientRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/match-requests", matchRequestRoutes);

module.exports = app;
