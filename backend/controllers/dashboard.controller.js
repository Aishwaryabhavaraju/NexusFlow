const Graph = require("../models/graph.model");
const Telemetry = require("../models/telemetry.model");

// @desc    Get aggregated dashboard metrics
// @route   GET /api/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalWorkflows,
      activeWorkflows,
      totalReadings,
      devices,
      recentTelemetry,
      recentWorkflows
    ] = await Promise.all([
      Graph.countDocuments(),
      Graph.countDocuments({ "config.isEnabled": true }),
      Telemetry.countDocuments(),
      Telemetry.distinct("metadata.deviceId"),
      Telemetry.find()
        .sort({ timestamp: -1 })
        .limit(20)
        .lean(),
      Graph.find()
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("name description config nodes edges createdAt updatedAt")
        .lean()
    ]);

    // Sample/recent alert records
    const recentAlerts = [
      {
        id: "alert-1",
        deviceId: "TURBINE-001",
        metric: "temperature",
        message: "Turbine temperature exceeded critical threshold (> 95°C)",
        severity: "critical",
        timestamp: new Date(Date.now() - 1000 * 60 * 12)
      },
      {
        id: "alert-2",
        deviceId: "PUMP-002",
        metric: "pressure",
        message: "Pump hydraulic pressure warning (> 140 psi)",
        severity: "warning",
        timestamp: new Date(Date.now() - 1000 * 60 * 45)
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        totalWorkflows,
        activeWorkflows,
        connectedDevices: devices.length,
        totalReadings,
        recentAlerts,
        recentTelemetry: recentTelemetry.map((r) => ({
          _id: r._id,
          deviceId: r.metadata?.deviceId,
          metric: r.metadata?.metric,
          value: r.value,
          timestamp: r.timestamp
        })),
        recentWorkflows
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
