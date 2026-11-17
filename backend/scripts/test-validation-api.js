const app = require("../app");
const http = require("http");

const PORT = 5001;

const validGraph = {
  name: "Turbine Temperature Alert",
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
      data: { deviceId: "TURBINE-001", metric: "temperature" }
    },
    {
      id: "average-1",
      type: "movingAverage",
      position: { x: 350, y: 150 },
      data: { windowSize: 5 }
    },
    {
      id: "threshold-1",
      type: "threshold",
      position: { x: 550, y: 150 },
      data: { operator: "gte", value: 80 }
    },
    {
      id: "alert-1",
      type: "smsAlert",
      position: { x: 750, y: 150 },
      data: { message: "Temperature exceeded the limit" }
    }
  ],
  edges: [
    { id: "edge-1", source: "sensor-1", target: "average-1" },
    { id: "edge-2", source: "average-1", target: "threshold-1" },
    { id: "edge-3", source: "threshold-1", target: "alert-1" }
  ]
};

const server = app.listen(PORT, async () => {
  try {
    console.log("Testing POST /api/graphs/validate with valid graph:");
    const res1 = await fetch(`http://localhost:${PORT}/api/graphs/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validGraph)
    });
    console.log("Status:", res1.status);
    console.log("Body:", await res1.json());

    console.log("\nTesting POST /api/graphs/validate with invalid graph (unsupported node type):");
    const invalidGraph = structuredClone(validGraph);
    invalidGraph.nodes[1].type = "unknownNode";
    const res2 = await fetch(`http://localhost:${PORT}/api/graphs/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidGraph)
    });
    console.log("Status:", res2.status);
    console.log("Body:", await res2.json());

    console.log("\nValidation API tests completed successfully!");
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    server.close();
  }
});
