const express = require("express");
const router = express.Router();
const { publishTelemetry } = require("../services/telemetryStream.service");

// Telemetry ingestion endpoint
router.post("/", (req, res) => {
  try {
    const telemetry = req.body;
    const events = publishTelemetry(telemetry);
    const primaryEvent = Array.isArray(events) ? events[0] : events;

    return res.status(200).json({
      success: true,
      message: "Telemetry ingested and published successfully",
      data: primaryEvent || {
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

// Bulk telemetry ingestion endpoint
router.post("/bulk", (req, res) => {
  try {
    const rawReadings = Array.isArray(req.body) ? req.body : req.body.readings;
    if (!Array.isArray(rawReadings)) {
      return res.status(400).json({
        success: false,
        message: "An array of readings is required"
      });
    }

    const allEvents = [];
    rawReadings.forEach((reading) => {
      const events = publishTelemetry(reading);
      if (Array.isArray(events)) {
        allEvents.push(...events);
      } else {
        allEvents.push(events);
      }
    });

    return res.status(200).json({
      success: true,
      message: "Bulk telemetry stored and published",
      count: allEvents.length
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
