const express = require("express");
const router = express.Router();

// Member 2 will implement these endpoints.
router.post("/", (req, res) => {
  res.status(501).json({
    success: false,
    message: "Telemetry ingestion is under development"
  });
});

router.get("/", (req, res) => {
  res.status(501).json({
    success: false,
    message: "Telemetry retrieval is under development"
  });
});

module.exports = router;

