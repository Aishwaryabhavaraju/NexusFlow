const parseGraph = require("../compiler/graphParser");
const sortGraphNodes = require("../compiler/graphSorter");

const graph = {
  name: "Turbine Monitoring Workflow",

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
      position: { x: 300, y: 150 },
      data: {
        label: "Moving Average",
        windowSize: 5
      }
    },
    {
      id: "threshold-1",
      type: "threshold",
      position: { x: 500, y: 150 },
      data: {
        label: "Threshold",
        operator: "gte",
        value: 80
      }
    },
    {
      id: "alert-1",
      type: "smsAlert",
      position: { x: 700, y: 150 },
      data: {
        label: "SMS Alert",
        message: "Temperature exceeded limit!"
      }
    }
  ],

  edges: [
    {
      id: "edge-1",
      source: "sensor-1",
      target: "filter-1"
    },
    {
      id: "edge-2",
      source: "filter-1",
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
  const parsedGraph = parseGraph(graph);

  const executionOrder =
    sortGraphNodes(parsedGraph);

  console.log("\nGraph traversal successful!");
  console.log("\nExecution Order:");

  executionOrder.forEach((node, index) => {
    console.log(
      `${index + 1}. ${node.data.label} (${node.id})`
    );
  });

} catch (error) {
  console.error("Graph sorting failed:", error.message);
}
