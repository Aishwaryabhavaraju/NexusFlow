const Telemetry = require("../models/telemetry.model");
const { publishTelemetry } = require("../services/telemetryStream.service");
const { emitTelemetry } = require("../utils/socket");

/**
 * Validates a single telemetry payload.
 */
const validateReading = (item) => {
  if (!item || typeof item !== "object") {
    throw new Error("Telemetry payload must be an object");
  }

  const deviceId = item.deviceId || item.metadata?.deviceId;
  if (typeof deviceId !== "string" || !deviceId.trim()) {
    throw new Error("A valid deviceId is required");
  }

  const metric = item.metric || item.metadata?.metric;
  if (typeof metric !== "string" || !metric.trim()) {
    throw new Error("A valid metric name is required");
  }

  if (typeof item.value !== "number" || !Number.isFinite(item.value)) {
    throw new Error("Telemetry value must be a valid finite number");
  }

  const timestamp = item.timestamp ? new Date(item.timestamp) : new Date();
  if (Number.isNaN(timestamp.getTime())) {
    throw new Error("Invalid telemetry timestamp");
  }

  return {
    timestamp,
    metadata: {
      deviceId: deviceId.trim(),
      metric: metric.trim()
    },
    value: item.value
  };
};

// @desc    Single telemetry ingestion
// @route   POST /api/telemetry
// @access  Public
const ingestSingle = async (req, res, next) => {
  try {
    const docData = validateReading(req.body);

    // Save into native MongoDB Time-Series collection
    const saved = await Telemetry.create(docData);

    // Feed to RxJS stream processor for rules and compiler pipelines
    publishTelemetry({
      deviceId: docData.metadata.deviceId,
      metric: docData.metadata.metric,
      value: docData.value,
      timestamp: docData.timestamp
    });

    // Notify connected Socket.IO clients
    emitTelemetry("telemetry:reading", {
      _id: saved._id,
      deviceId: docData.metadata.deviceId,
      metric: docData.metadata.metric,
      value: docData.value,
      timestamp: docData.timestamp
    });

    return res.status(201).json({
      success: true,
      message: "Telemetry ingested and published successfully",
      data: {
        _id: saved._id,
        deviceId: docData.metadata.deviceId,
        metric: docData.metadata.metric,
        value: docData.value,
        timestamp: docData.timestamp
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Bulk telemetry ingestion
// @route   POST /api/telemetry/bulk
// @access  Public
const ingestBulk = async (req, res, next) => {
  try {
    const rawReadings = Array.isArray(req.body)
      ? req.body
      : req.body.readings;

    if (!Array.isArray(rawReadings) || rawReadings.length === 0) {
      return res.status(400).json({
        success: false,
        message: "An array of readings is required in request body"
      });
    }

    if (rawReadings.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Bulk ingestion batch exceeds maximum limit of 5000 readings"
      });
    }

    const validatedDocs = [];
    for (let i = 0; i < rawReadings.length; i++) {
      try {
        validatedDocs.push(validateReading(rawReadings[i]));
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `Validation failed at reading index ${i}: ${err.message}`
        });
      }
    }

    // High performance bulk write into MongoDB Time-Series collection
    const inserted = await Telemetry.insertMany(validatedDocs, {
      ordered: false
    });

    // Forward readings to RxJS stream
    validatedDocs.forEach((doc) => {
      publishTelemetry({
        deviceId: doc.metadata.deviceId,
        metric: doc.metadata.metric,
        value: doc.value,
        timestamp: doc.timestamp
      });
    });

    // Notify connected real-time clients
    emitTelemetry("telemetry:bulk", {
      count: inserted.length,
      timestamp: new Date()
    });

    return res.status(201).json({
      success: true,
      message: `Successfully ingested ${inserted.length} telemetry readings`,
      count: inserted.length
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Query telemetry readings
// @route   GET /api/telemetry
// @access  Public
const getTelemetry = async (req, res, next) => {
  try {
    const {
      deviceId,
      metric,
      startDate,
      endDate,
      limit = 50,
      page = 1
    } = req.query;

    const query = {};

    if (deviceId) {
      query["metadata.deviceId"] = deviceId;
    }

    if (metric) {
      query["metadata.metric"] = metric;
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(1000, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [total, records] = await Promise.all([
      Telemetry.countDocuments(query),
      Telemetry.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    const formatted = records.map((r) => ({
      _id: r._id,
      deviceId: r.metadata?.deviceId,
      metric: r.metadata?.metric,
      value: r.value,
      timestamp: r.timestamp
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get telemetry statistics and device breakdown
// @route   GET /api/telemetry/stats
// @access  Public
const getTelemetryStats = async (req, res, next) => {
  try {
    const [totalReadings, devices, metrics] = await Promise.all([
      Telemetry.countDocuments(),
      Telemetry.distinct("metadata.deviceId"),
      Telemetry.distinct("metadata.metric")
    ]);

    // Get latest reading per device
    const latestPerDevice = await Promise.all(
      devices.map(async (deviceId) => {
        const latest = await Telemetry.findOne({
          "metadata.deviceId": deviceId
        })
          .sort({ timestamp: -1 })
          .lean();

        return {
          deviceId,
          metric: latest?.metadata?.metric,
          value: latest?.value,
          lastSeen: latest?.timestamp
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        totalReadings,
        connectedDevices: devices.length,
        devices,
        metrics,
        deviceStatus: latestPerDevice
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate mock telemetry readings for testing & demonstration
// @route   POST /api/telemetry/mock
// @access  Public
const generateMockTelemetry = async (req, res, next) => {
  try {
    const count = Math.min(50, Math.max(1, parseInt(req.body.count, 10) || 10));

    const sampleDevices = ["TURBINE-001", "PUMP-002", "BOILER-003", "VALVE-004"];
    const metricConfigs = {
      temperature: { min: 60, max: 105, unit: "°C" },
      pressure: { min: 80, max: 160, unit: "psi" },
      vibration: { min: 0.1, max: 4.5, unit: "mm/s" },
      flowRate: { min: 20, max: 100, unit: "L/min" }
    };
    const metrics = Object.keys(metricConfigs);

    const mockDocs = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      const deviceId = sampleDevices[i % sampleDevices.length];
      const metric = metrics[i % metrics.length];
      const config = metricConfigs[metric];
      const value = parseFloat(
        (Math.random() * (config.max - config.min) + config.min).toFixed(2)
      );
      const timestamp = new Date(now - (count - i) * 2000);

      mockDocs.push({
        timestamp,
        metadata: { deviceId, metric },
        value
      });
    }

    const inserted = await Telemetry.insertMany(mockDocs, { ordered: false });

    mockDocs.forEach((doc) => {
      publishTelemetry({
        deviceId: doc.metadata.deviceId,
        metric: doc.metadata.metric,
        value: doc.value,
        timestamp: doc.timestamp
      });
    });

    emitTelemetry("telemetry:bulk", {
      count: inserted.length,
      timestamp: new Date()
    });

    return res.status(201).json({
      success: true,
      message: `Generated and ingested ${inserted.length} mock telemetry events`,
      count: inserted.length,
      data: mockDocs.map((d) => ({
        deviceId: d.metadata.deviceId,
        metric: d.metadata.metric,
        value: d.value,
        timestamp: d.timestamp
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  ingestSingle,
  ingestBulk,
  getTelemetry,
  getTelemetryStats,
  generateMockTelemetry
};
