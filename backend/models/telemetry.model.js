const mongoose = require("mongoose");

/**
 * Telemetry Model configured for native MongoDB Time-Series collection.
 * TimeField: timestamp
 * MetaField: metadata { deviceId, metric }
 */
const telemetrySchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      required: [true, "Timestamp is required"],
      default: Date.now
    },
    metadata: {
      deviceId: {
        type: String,
        required: [true, "Device ID is required"],
        trim: true,
        index: true
      },
      metric: {
        type: String,
        required: [true, "Metric name is required"],
        trim: true,
        index: true
      }
    },
    value: {
      type: Number,
      required: [true, "Telemetry value is required"]
    }
  },
  {
    timeseries: {
      timeField: "timestamp",
      metaField: "metadata",
      granularity: "seconds"
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.deviceId = ret.metadata?.deviceId || ret.deviceId;
        ret.metric = ret.metadata?.metric || ret.metric;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Virtual getters for simplified API consumption
telemetrySchema.virtual("deviceId").get(function () {
  return this.metadata?.deviceId;
});

telemetrySchema.virtual("metric").get(function () {
  return this.metadata?.metric;
});

module.exports = mongoose.model("Telemetry", telemetrySchema);
