const app = require("../app");

const PORT = 5000;
const server = app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  try {
    // 1. GET /api/health
    console.log("\n--- Request 1: GET /api/health ---");
    const healthRes = await fetch(`http://localhost:${PORT}/api/health`);
    console.log("Status:", healthRes.status);
    console.log("Body:", await healthRes.json());

    // 2. POST /api/graphs
    console.log("\n--- Request 2: POST /api/graphs ---");
    const graphPayload = {
      name: "Turbine Alert",
      nodes: [
        { id: "sensor-1", type: "sensor", data: { metric: "temperature" } },
        { id: "alert-1", type: "smsAlert", data: { threshold: 80 } }
      ],
      edges: [
        { id: "edge-1", source: "sensor-1", target: "alert-1" }
      ]
    };
    const createRes = await fetch(`http://localhost:${PORT}/api/graphs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphPayload)
    });
    console.log("Status:", createRes.status);
    const createdData = await createRes.json();
    console.log("Body:", createdData);

    const graphId = createdData.data.graphId;

    // 3. GET /api/graphs/:graphId
    console.log(`\n--- Request 3: GET /api/graphs/${graphId} ---`);
    const getRes = await fetch(`http://localhost:${PORT}/api/graphs/${graphId}`);
    console.log("Status:", getRes.status);
    console.log("Body:", await getRes.json());

    // 4. Test telemetry endpoint
    console.log("\n--- Request 4: POST /api/telemetry ---");
    const telemRes = await fetch(`http://localhost:${PORT}/api/telemetry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId: "TURBINE-001" })
    });
    console.log("Status:", telemRes.status);
    console.log("Body:", await telemRes.json());

    // 5. Test rule execution endpoint
    console.log(`\n--- Request 5: POST /api/rules/${graphId}/execute ---`);
    const ruleRes = await fetch(`http://localhost:${PORT}/api/rules/${graphId}/execute`, {
      method: "POST"
    });
    console.log("Status:", ruleRes.status);
    console.log("Body:", await ruleRes.json());

    console.log("\nAll endpoint tests completed successfully!");
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  }
});

