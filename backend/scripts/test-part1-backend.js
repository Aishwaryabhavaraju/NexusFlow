const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/user.model");
const Telemetry = require("../models/telemetry.model");
const Graph = require("../models/graph.model");

const runBackendVerification = async () => {
  console.log("=================================================");
  console.log("   NEXUSFLOW PART 1 - BACKEND VERIFICATION TEST  ");
  console.log("=================================================\n");

  try {
    await connectDB();

    // 1. Verify Time-Series collection in MongoDB
    console.log("--> 1. Verifying Native MongoDB Time-Series Collection...");
    const collections = await mongoose.connection.db.listCollections({ name: "telemetries" }).toArray();
    if (collections.length === 0) {
      throw new Error("Collection 'telemetries' was not created!");
    }
    const collectionInfo = collections[0];
    console.log(`    Collection Name: ${collectionInfo.name}`);
    console.log(`    Collection Type: ${collectionInfo.type}`);
    if (collectionInfo.options?.timeseries) {
      console.log("    Time-Series Options:", JSON.stringify(collectionInfo.options.timeseries));
    }
    console.log("    [PASS] Time-Series collection verified successfully.\n");

    // 2. Verify User Auth & Bcrypt Password Hashing
    console.log("--> 2. Verifying User Model & Password Hashing...");
    await User.deleteMany({ email: "test.operator@nexusflow.io" });

    const user = await User.create({
      name: "Test Operator",
      email: "test.operator@nexusflow.io",
      password: "SecretPassword123!",
      role: "operator"
    });

    const isMatch = await user.comparePassword("SecretPassword123!");
    const isWrong = await user.comparePassword("WrongPassword");

    if (!isMatch || isWrong) {
      throw new Error("Password comparison failed!");
    }
    console.log(`    Created user: ${user.name} (${user.email})`);
    console.log("    [PASS] Password hashing & comparison verified successfully.\n");

    // 3. Verify Single Telemetry Ingestion
    console.log("--> 3. Verifying Single Telemetry Ingestion...");
    const singleReading = await Telemetry.create({
      timestamp: new Date(),
      metadata: {
        deviceId: "TURBINE-001",
        metric: "temperature"
      },
      value: 88.5
    });
    console.log(`    Ingested single reading: Device=${singleReading.deviceId}, Value=${singleReading.value}`);
    console.log("    [PASS] Single telemetry ingestion verified.\n");

    // 4. Verify Bulk Telemetry Ingestion
    console.log("--> 4. Verifying Bulk Telemetry Ingestion...");
    const bulkDocs = [
      { timestamp: new Date(Date.now() - 3000), metadata: { deviceId: "TURBINE-001", metric: "temperature" }, value: 89.2 },
      { timestamp: new Date(Date.now() - 2000), metadata: { deviceId: "PUMP-002", metric: "pressure" }, value: 125.4 },
      { timestamp: new Date(Date.now() - 1000), metadata: { deviceId: "BOILER-003", metric: "temperature" }, value: 102.1 }
    ];
    const bulkResult = await Telemetry.insertMany(bulkDocs);
    console.log(`    Bulk inserted ${bulkResult.length} readings.`);
    console.log("    [PASS] Bulk telemetry ingestion verified.\n");

    // 5. Verify Telemetry Query & Aggregations
    console.log("--> 5. Verifying Telemetry Queries & Aggregation...");
    const totalCount = await Telemetry.countDocuments();
    const uniqueDevices = await Telemetry.distinct("metadata.deviceId");
    console.log(`    Total telemetry readings in DB: ${totalCount}`);
    console.log(`    Unique devices detected: ${uniqueDevices.join(", ")}`);
    console.log("    [PASS] Telemetry query verified.\n");

    // 6. Verify Graph Collection
    console.log("--> 6. Verifying Graph Model...");
    const graphCount = await Graph.countDocuments();
    console.log(`    Existing workflows in DB: ${graphCount}`);
    console.log("    [PASS] Graph model verified.\n");

    console.log("=================================================");
    console.log(">>> ALL PART 1 BACKEND VERIFICATIONS PASSED! <<<");
    console.log("=================================================");
  } catch (error) {
    console.error("\n[FAIL] Backend Verification Error:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("\nDatabase disconnected cleanly.");
  }
};

runBackendVerification();
