require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error("Missing MONGODB_URI or JWT_SECRET in .env");
  process.exit(1);
}

if (process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must contain at least 32 characters.");
  process.exit(1);
}

app.disable("x-powered-by");
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "CareerIntel backend is running.",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: mongoose.connection.readyState === 1 ? "healthy" : "starting",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/analyses", analysisRoutes);
app.use("/api/roadmaps", roadmapRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found." });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ message: "Internal server error." });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully.");

    app.listen(PORT, () => {
      console.log(`CareerIntel backend: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();