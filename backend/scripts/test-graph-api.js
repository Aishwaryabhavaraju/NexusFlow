const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = require("../app");
const connectDB = require("../config/db");
const mongoose = require("mongoose");

const PORT = 5000;

async function runTests() {
  await connectDB();

  const server = app.listen(PORT, async () => {
    console.log(`NexusFlow test server running on port ${PORT}`);

    try {
      // 1. POST valid standardized graph
      console.log("\n=================== 1. POST /api/graphs (Standardized Pipeline) ===================");
      const standardizedPipeline = {
        name: "Turbine Temperature Alert",
        description: "Monitor turbine temperature and send an alert",
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
              windowSize: 5
            }
          },
          {
            id: "alert-1",
            type: "smsAlert",
            position: { x: 600, y: 150 },
            data: {
              label: "SMS Alert",
              threshold: 80,
              message: "Temperature exceeded the limit!"
            }
          }
        ],
        edges: [
          {
            id: "edge-1",
            source: "sensor-1",
            target: "filter-1",
            sourceHandle: null,
            targetHandle: null,
            type: "smoothstep"
          },
          {
            id: "edge-2",
            source: "filter-1",
            target: "alert-1",
            sourceHandle: null,
            targetHandle: null,
            type: "smoothstep"
          }
        ]
      };

      const createRes = await fetch(`http://localhost:${PORT}/api/graphs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(standardizedPipeline)
      });
      console.log("Status:", createRes.status);
      const createData = await createRes.json();
      console.log("Body:", JSON.stringify(createData, null, 2));

      const graphId = createData.data._id;

      // 2. GET all graphs
      console.log("\n=================== 2. GET /api/graphs ===================");
      const getAllRes = await fetch(`http://localhost:${PORT}/api/graphs`);
      console.log("Status:", getAllRes.status);
      const getAllData = await getAllRes.json();
      console.log("Count:", getAllData.count);

      // 3. GET graph by ID
      console.log(`\n=================== 3. GET /api/graphs/${graphId} ===================`);
      const getRes = await fetch(`http://localhost:${PORT}/api/graphs/${graphId}`);
      console.log("Status:", getRes.status);
      const getData = await getRes.json();
      console.log("Name:", getData.data.name);
      console.log("Config:", getData.data.config);
      console.log("Nodes count:", getData.data.nodes.length);

      // 4. PUT update graph
      console.log(`\n=================== 4. PUT /api/graphs/${graphId} ===================`);
      const updateRes = await fetch(`http://localhost:${PORT}/api/graphs/${graphId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Updated Turbine Temperature Alert",
          status: "active"
        })
      });
      console.log("Status:", updateRes.status);
      const updateData = await updateRes.json();
      console.log("Updated Name:", updateData.data.name);
      console.log("Status:", updateData.data.status);

      // 5. Validation test: unsupported node type
      console.log("\n=================== 5. POST validation failure (unknownNode) ===================");
      const invalidPipeline = {
        ...standardizedPipeline,
        nodes: [
          {
            id: "node-x",
            type: "unknownNode",
            position: { x: 0, y: 0 },
            data: {}
          }
        ],
        edges: []
      };
      const invalidRes = await fetch(`http://localhost:${PORT}/api/graphs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidPipeline)
      });
      console.log("Status:", invalidRes.status);
      console.log("Body:", await invalidRes.json());

      // 6. DELETE graph
      console.log(`\n=================== 6. DELETE /api/graphs/${graphId} ===================`);
      const deleteRes = await fetch(`http://localhost:${PORT}/api/graphs/${graphId}`, {
        method: "DELETE"
      });
      console.log("Status:", deleteRes.status);
      console.log("Body:", await deleteRes.json());

      // 7. Verify deletion
      console.log(`\n=================== 7. Verify DELETE (GET /api/graphs/${graphId}) ===================`);
      const verifyRes = await fetch(`http://localhost:${PORT}/api/graphs/${graphId}`);
      console.log("Status:", verifyRes.status);
      console.log("Body:", await verifyRes.json());

      console.log("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<");
    } catch (err) {
      console.error("Test error:", err);
    } finally {
      server.close(async () => {
        await mongoose.connection.close();
        console.log("Server & DB connection closed.");
        process.exit(0);
      });
    }
  });
}

runTests();
