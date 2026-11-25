const mongoose = require("mongoose");

/**
 * Ensures the native MongoDB Time-Series collection exists for IoT telemetry.
 * In MongoDB 5.0+, timeseries collections optimize storage and queries
 * by storing measurements over time in an optimized bucketed columnar format.
 */
const ensureTimeSeriesCollection = async () => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections({ name: "telemetries" }).toArray();

    if (collections.length === 0) {
      await db.createCollection("telemetries", {
        timeseries: {
          timeField: "timestamp",
          metaField: "metadata",
          granularity: "seconds"
        }
      });
      console.log("Native MongoDB Time-Series collection 'telemetries' created successfully");
    } else {
      console.log(`MongoDB collection 'telemetries' exists (type: ${collections[0].type || "standard"})`);
    }
  } catch (error) {
    console.warn("Time-Series collection initialization notice:", error.message);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
    await ensureTimeSeriesCollection();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
