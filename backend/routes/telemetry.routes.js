const express = require("express");
const router = express.Router();
const {
  ingestSingle,
  ingestBulk,
  getTelemetry,
  getTelemetryStats,
  generateMockTelemetry
} = require("../controllers/telemetry.controller");

// Telemetry statistics
router.get("/stats", getTelemetryStats);

// Mock telemetry generator
router.post("/mock", generateMockTelemetry);

// Bulk ingestion
router.post("/bulk", ingestBulk);

// Single ingestion & query
router.post("/", ingestSingle);
router.get("/", getTelemetry);

module.exports = router;
