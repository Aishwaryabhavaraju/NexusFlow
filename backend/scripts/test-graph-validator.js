const parseGraph = require("../compiler/graphParser");
const validateGraph = require("../compiler/graphValidator");

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
        message: "Temperature exceeded the limit"
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

// Helper function to run validation tests
const runTest = (testName, graph) => {
  console.log(`\nTesting: ${testName}`);

  try {
    const parsedGraph = parseGraph(graph);
    const result = validateGraph(parsedGraph);

    console.log("Valid:", result.isValid);

    if (result.errors.length > 0) {
      console.log("Errors:");

      result.errors.forEach((error) => {
        console.log("-", error);
      });
    }
  } catch (error) {
    console.log("Parser error:", error.message);
  }
};

// Test 1: Valid graph
runTest("Valid graph", structuredClone(validGraph));

// Test 2: Unsupported node type
const invalidType = structuredClone(validGraph);
invalidType.nodes[1].type = "unknownNode";

runTest("Invalid node type", invalidType);

// Test 3: Invalid moving average configuration
const invalidWindow = structuredClone(validGraph);
invalidWindow.nodes[1].data.windowSize = -5;

runTest("Invalid moving average window", invalidWindow);

// Test 4: Invalid edge target
const invalidConnection = structuredClone(validGraph);
invalidConnection.edges[0].target = "missing-node";

runTest("Invalid edge connection", invalidConnection);

// Test 5: Duplicate node ID
const duplicateNode = structuredClone(validGraph);
duplicateNode.nodes[1].id = "sensor-1";

runTest("Duplicate node ID", duplicateNode);

// Test 6: Invalid threshold configuration
const invalidThreshold = structuredClone(validGraph);
invalidThreshold.nodes[2].data.operator = "between";

runTest("Invalid threshold operator", invalidThreshold);

// Test 7: Circular connection
const circularGraph = structuredClone(validGraph);
circularGraph.edges.push({
  id: "edge-4",
  source: "alert-1",
  target: "sensor-1"
});

runTest("Circular graph", circularGraph);

// Test 8: Missing SMS message
const invalidAlert = structuredClone(validGraph);
invalidAlert.nodes[3].data.message = "";

runTest("Missing SMS alert message", invalidAlert);
