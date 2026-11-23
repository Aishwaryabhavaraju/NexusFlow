const express = require("express");
const router = express.Router();
const { publishTelemetry } = require("../services/telemetryStream.service");

// Member 2 telemetry ingestion endpoint
router.post("/", (req, res) => {
  try {
    const telemetry = req.body;
    publishTelemetry(telemetry);

    return res.status(200).json({
      success: true,
      message: "Telemetry ingested and published successfully",
      data: {
        deviceId: telemetry.deviceId,
        metric: telemetry.metric,
        value: telemetry.value,
        timestamp: telemetry.timestamp || new Date()
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/", (req, res) => {
  res.status(501).json({
    success: false,
    message: "Telemetry retrieval is under development"
  });
});

module.exports = router;
