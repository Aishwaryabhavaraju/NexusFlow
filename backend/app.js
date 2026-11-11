const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const graphRoutes = require("./routes/graph.routes");
const telemetryRoutes = require("./routes/telemetry.routes");
const ruleRoutes = require("./routes/rule.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// Security and middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NexusFlow backend is running",
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use("/api/graphs", graphRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/rules", ruleRoutes);

// Invalid route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

// Central error handler
app.use(errorHandler);

module.exports = app;
