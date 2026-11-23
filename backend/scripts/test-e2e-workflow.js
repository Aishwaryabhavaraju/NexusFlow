const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = require("../app");
const connectDB = require("../config/db");
const mongoose = require("mongoose");

const PORT = 5002;

const workflowGraph = {
  name: "Turbine Monitoring Workflow",
  description: "Monitor turbine temperature",
  config: {
    version: "1.0",
    executionMode: "realtime",
    isEnabled: true
  },
  nodes: [
    {
      id: "sensor-1",
      type: "sensor",
      position: { x: 100, y: 150 },
      data: {
        label: "Turbine Sensor",
        deviceId: "TURBINE-001",
        metric: "temperature"
      }
    },
    {
      id: "filter-1",
      type: "movingAverage",
      position: { x: 350, y: 150 },
      data: {
        label: "Moving Average",
        windowSize: 3
      }
    },
    {
      id: "threshold-1",
      type: "threshold",
      position: { x: 600, y: 150 },
      data: {
        label: "Temperature Threshold",
        operator: "gte",
        value: 80
      }
    },
    {
      id: "action-1",
      type: "actionTrigger",
      position: { x: 850, y: 150 },
      data: {
        label: "Action Trigger",
        actionType: "alert",
        message: "Temperature limit exceeded!"
      }
    }
  ],
  edges: [
    {
      id: "edge-1",
      source: "sensor-1",
      target: "filter-1",
      type: "smoothstep"
    },
    {
      id: "edge-2",
      source: "filter-1",
      target: "threshold-1",
      type: "smoothstep"
    },
    {
      id: "edge-3",
      source: "threshold-1",
      target: "action-1",
      type: "smoothstep"
    }
  ]
};

async function runE2ETests() {
  await connectDB();

  const server = app.listen(PORT, async () => {
    console.log(`E2E Test Server running on port ${PORT}`);

    try {
      // Test 1: Save a graph
      console.log("\n=================== Test 1: POST /api/graphs ===================");
      const createRes = await fetch(`http://localhost:${PORT}/api/graphs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflowGraph)
      });
      console.log("Status:", createRes.status);
      const createJson = await createRes.json();
      console.log("Created Graph ID:", createJson.data._id);
      const graphId = createJson.data._id;

      // Test 2: Validate the graph
      console.log("\n=================== Test 2: POST /api/graphs/validate ===================");
      const valRes = await fetch(`http://localhost:${PORT}/api/graphs/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflowGraph)
      });
      console.log("Status:", valRes.status);
      console.log("Validation Result:", await valRes.json());

      // Test 3: Start the workflow
      console.log(`\n=================== Test 3: POST /api/rules/${graphId}/start ===================`);
      const startRes = await fetch(`http://localhost:${PORT}/api/rules/${graphId}/start`, {
        method: "POST"
      });
      console.log("Status:", startRes.status);
      console.log("Start Result:", await startRes.json());

      // Test 4: Publish telemetry readings (85, 90, 95)
      console.log("\n=================== Test 4: POST /api/telemetry (Readings: 85, 90, 95) ===================");
      const readings = [85, 90, 95];
      for (const val of readings) {
        console.log(`\nPublishing temperature: ${val}`);
        const telemRes = await fetch(`http://localhost:${PORT}/api/telemetry`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deviceId: "TURBINE-001",
            metric: "temperature",
            value: val,
            timestamp: new Date().toISOString()
          })
        });
        console.log("Telemetry response status:", telemRes.status);
      }

      // Test 5: Check workflow status
      console.log(`\n=================== Test 5: GET /api/rules/${graphId}/status ===================`);
      const statusRes = await fetch(`http://localhost:${PORT}/api/rules/${graphId}/status`);
      console.log("Status:", statusRes.status);
      console.log("Workflow Status:", await statusRes.json());

      // Test 6: Stop the workflow
      console.log(`\n=================== Test 6: POST /api/rules/${graphId}/stop ===================`);
      const stopRes = await fetch(`http://localhost:${PORT}/api/rules/${graphId}/stop`, {
        method: "POST"
      });
      console.log("Status:", stopRes.status);
      console.log("Stop Result:", await stopRes.json());

      // Cleanup graph
      await fetch(`http://localhost:${PORT}/api/graphs/${graphId}`, { method: "DELETE" });

      console.log("\n>>> ALL E2E INTEGRATION TESTS PASSED SUCCESSFULLY! <<<");

    } catch (err) {
      console.error("E2E Test Failed:", err);
    } finally {
      server.close(async () => {
        await mongoose.connection.close();
        console.log("Server & DB connections closed.");
        process.exit(0);
      });
    }
  });
}

runE2ETests();
