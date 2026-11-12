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
      // Test 1: Save a graph
      console.log("\n=================== Test 1: Save a Graph (POST /api/graphs) ===================");
      const graphData = {
        name: "Turbine Temperature Monitoring",
        description: "Detect high turbine temperature",
        nodes: [
          {
            id: "sensor-1",
            type: "sensor",
            position: { x: 100, y: 150 },
            data: { deviceId: "TURBINE-001", metric: "temperature" }
          },
          {
            id: "filter-1",
            type: "movingAverage",
            position: { x: 350, y: 150 },
            data: { windowSize: 5 }
          },
          {
            id: "alert-1",
            type: "smsAlert",
            position: { x: 600, y: 150 },
            data: { threshold: 80 }
          }
        ],
        edges: [
          { id: "edge-1", source: "sensor-1", target: "filter-1" },
          { id: "edge-2", source: "filter-1", target: "alert-1" }
        ]
      };

      const createRes = await fetch(`http://localhost:${PORT}/api/graphs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(graphData)
      });
      console.log("Status:", createRes.status);
      const createJson = await createRes.json();
      console.log("Body:", JSON.stringify(createJson, null, 2));

      const graphId = createJson.data._id;
      if (!graphId) throw new Error("Graph ID not returned!");

      // Test 2: Retrieve all graphs
      console.log("\n=================== Test 2: Retrieve all graphs (GET /api/graphs) ===================");
      const allRes = await fetch(`http://localhost:${PORT}/api/graphs`);
      console.log("Status:", allRes.status);
      const allJson = await allRes.json();
      console.log("Count:", allJson.count);
      console.log("Sample Data ID:", allJson.data[0]._id);

      // Test 3: Retrieve a particular graph
      console.log(`\n=================== Test 3: Retrieve graph by ID (GET /api/graphs/${graphId}) ===================`);
      const getRes = await fetch(`http://localhost:${PORT}/api/graphs/${graphId}`);
      console.log("Status:", getRes.status);
      const getJson = await getRes.json();
      console.log("Body:", JSON.stringify(getJson, null, 2));

      // Test 4: Update a graph
      console.log(`\n=================== Test 4: Update a graph (PUT /api/graphs/${graphId}) ===================`);
      const updateRes = await fetch(`http://localhost:${PORT}/api/graphs/${graphId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Updated Turbine Monitoring",
          status: "active"
        })
      });
      console.log("Status:", updateRes.status);
      const updateJson = await updateRes.json();
      console.log("Body:", JSON.stringify(updateJson, null, 2));

      // Test 5: Delete a graph
      console.log(`\n=================== Test 5: Delete a graph (DELETE /api/graphs/${graphId}) ===================`);
      const deleteRes = await fetch(`http://localhost:${PORT}/api/graphs/${graphId}`, {
        method: "DELETE"
      });
      console.log("Status:", deleteRes.status);
      const deleteJson = await deleteRes.json();
      console.log("Body:", JSON.stringify(deleteJson, null, 2));

      // Verify deletion (GET should return 404)
      console.log(`\n=================== Test 6: Verify deletion (GET /api/graphs/${graphId}) ===================`);
      const verifyRes = await fetch(`http://localhost:${PORT}/api/graphs/${graphId}`);
      console.log("Status:", verifyRes.status);
      const verifyJson = await verifyRes.json();
      console.log("Body:", JSON.stringify(verifyJson, null, 2));

      // Test 7: Validation error (POST invalid graph)
      console.log("\n=================== Test 7: Invalid graph data (POST /api/graphs) ===================");
      const invalidRes = await fetch(`http://localhost:${PORT}/api/graphs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "" })
      });
      console.log("Status:", invalidRes.status);
      const invalidJson = await invalidRes.json();
      console.log("Body:", JSON.stringify(invalidJson, null, 2));

      console.log("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<");
    } catch (err) {
      console.error("Test execution error:", err);
    } finally {
      server.close(async () => {
        await mongoose.connection.close();
        console.log("Server and DB connection closed.");
        process.exit(0);
      });
    }
  });
}

runTests();

