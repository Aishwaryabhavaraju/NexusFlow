const { Subject } = require("rxjs");
const StreamCompiler = require("../services/streamCompiler.service");

const testTelemetry$ = new Subject();

const sampleGraph = {
  name: "Turbine Temperature Monitoring",
  description: "Test the Stream Compiler integration",

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
      id: "math-1",
      type: "mathOperation",
      position: { x: 300, y: 150 },
      data: {
        label: "Add Calibration",
        operation: "add",
        operand: 0
      }
    },
    {
      id: "threshold-1",
      type: "threshold",
      position: { x: 500, y: 150 },
      data: {
        label: "Temperature Threshold",
        operator: "gte",
        value: 80
      }
    },
    {
      id: "action-1",
      type: "actionTrigger",
      position: { x: 700, y: 150 },
      data: {
        label: "Alert",
        actionType: "alert",
        message: "Turbine temperature exceeded 80 degrees!"
      }
    }
  ],

  edges: [
    {
      id: "edge-1",
      source: "sensor-1",
      target: "math-1"
    },
    {
      id: "edge-2",
      source: "math-1",
      target: "threshold-1"
    },
    {
      id: "edge-3",
      source: "threshold-1",
      target: "action-1"
    }
  ]
};

console.log("\nStarting Stream Compiler Integration Test...\n");

try {
  const subscription = StreamCompiler.execute(sampleGraph, {
    telemetryStream$: testTelemetry$,

    sendAlert: alert => {
      console.log("\nALERT RECEIVED:", alert.message);
    },

    onData: data => {
      console.log("Final processed reading:", data.value);
    },

    onError: error => {
      console.error("Test execution failed:", error.message);
    }
  });

  console.log("\nWorkflow compiled and subscribed successfully.");

  // Simulate incoming sensor readings
  const readings = [65, 75, 85, 90, 70];

  readings.forEach(value => {
    console.log(`\nPublishing temperature: ${value}`);

    testTelemetry$.next({
      deviceId: "TURBINE-001",
      metric: "temperature",
      value,
      timestamp: new Date()
    });
  });

  subscription.unsubscribe();
  testTelemetry$.complete();

  console.log("\nStream Compiler Integration Test Finished.");

} catch (error) {
  console.error("\nCompiler Integration Error:", error.message);

  if (error.validationErrors) {
    console.error("Validation errors:", error.validationErrors);
  }

  process.exitCode = 1;
}
