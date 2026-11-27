const StreamCompiler = require("../services/streamCompiler.service");

const {
  publishTelemetry
} = require("../services/telemetryStream.service");

const graph = {
  name: "Live Turbine Monitoring",

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
      id: "average-1",
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
        label: "Alert",
        actionType: "alert",
        message: "Turbine temperature exceeded 80 degrees!"
      }
    }
  ],

  edges: [
    { id: "e1", source: "sensor-1", target: "average-1" },
    { id: "e2", source: "average-1", target: "threshold-1" },
    { id: "e3", source: "threshold-1", target: "action-1" }
  ]
};

console.log("\nStarting Live Telemetry Integration Test...\n");

// Start the workflow and subscribe to shared telemetry
const subscription = StreamCompiler.execute(graph, {
  sendAlert: alert => {
    console.log("\nALERT RECEIVED!");
    console.log("Device:", alert.deviceId);
    console.log("Value:", alert.value);
    console.log("Message:", alert.message);
  },

  onData: data => {
    console.log("Processed workflow output:", data.value);
  },

  onError: error => {
    console.error("Workflow error:", error.message);
  }
});

console.log("\nWorkflow is now active.\n");

// Simulate incoming telemetry
const readings = [70, 80, 90, 100, 110];

readings.forEach((value, index) => {
  console.log(`Publishing reading ${index + 1}: ${value}`);

  publishTelemetry({
    deviceId: "TURBINE-001",
    metric: "temperature",
    value,
    timestamp: new Date()
  });
});

// Send a reading from another device.
// The Sensor node should ignore it.
console.log("\nPublishing reading from another device...");

publishTelemetry({
  deviceId: "TURBINE-002",
  metric: "temperature",
  value: 150,
  timestamp: new Date()
});

// Stop workflow
subscription.unsubscribe();

console.log("\nWorkflow subscription stopped.");

// This reading should not reach the stopped workflow
console.log("Publishing after stopping workflow...");

publishTelemetry({
  deviceId: "TURBINE-001",
  metric: "temperature",
  value: 200,
  timestamp: new Date()
});

console.log("\nLive Telemetry Integration Test Completed.");
