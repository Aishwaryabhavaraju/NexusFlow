const parseGraph = require("../compiler/graphParser");

const graph = {
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
      data: {
        deviceId: "TURBINE-001",
        metric: "temperature"
      }
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
      data: {
        operator: "gte",
        value: 80
      }
    },
    {
      id: "alert-1",
      type: "smsAlert",
      position: { x: 750, y: 150 },
      data: {
        message: "Temperature is too high"
      }
    }
  ],

  edges: [
    {
      id: "edge-1",
      source: "sensor-1",
      target: "average-1"
    },
    {
      id: "edge-2",
      source: "average-1",
      target: "threshold-1"
    },
    {
      id: "edge-3",
      source: "threshold-1",
      target: "alert-1"
    }
  ]
};

try {
  const parsed = parseGraph(graph);

  console.log("Graph parsed successfully!");

  console.log(
    "Node IDs:",
    [...parsed.nodeMap.keys()]
  );

  console.log(
    "Source nodes:",
    parsed.sourceNodes.map((node) => node.id)
  );

  console.log(
    "Terminal nodes:",
    parsed.terminalNodes.map((node) => node.id)
  );

  console.log(
    "Outgoing edges from sensor-1:",
    parsed.outgoingEdges.get("sensor-1").map((edge) => edge.id)
  );

  console.log(
    "Incoming edges to average-1:",
    parsed.incomingEdges.get("average-1").map((edge) => edge.id)
  );
} catch (error) {
  console.error("Parser error:", error.message);
}
