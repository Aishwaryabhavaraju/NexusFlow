const { Subject } = require("rxjs");
const StreamCompiler = require("../services/streamCompiler.service");

const telemetry$ = new Subject();

const graph = {
  name: "Turbine Alert Workflow",

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
        label: "Calibration",
        operation: "add",
        operand: 0
      }
    },
    {
      id: "average-1",
      type: "movingAverage",
      position: { x: 500, y: 150 },
      data: {
        label: "Moving Average",
        windowSize: 3
      }
    },
    {
      id: "threshold-1",
      type: "threshold",
      position: { x: 700, y: 150 },
      data: {
        label: "Temperature Threshold",
        operator: "gte",
        value: 80
      }
    },
    {
      id: "action-1",
      type: "actionTrigger",
      position: { x: 900, y: 150 },
      data: {
        label: "Alert",
        actionType: "alert",
        message: "Turbine temperature is above the limit!"
      }
    }
  ],

  edges: [
    { id: "e1", source: "sensor-1", target: "math-1" },
    { id: "e2", source: "math-1", target: "average-1" },
    { id: "e3", source: "average-1", target: "threshold-1" },
    { id: "e4", source: "threshold-1", target: "action-1" }
  ]
};

console.log("\nTesting Node Registry and Pipeline Builder...\n");

try {
  const subscription = StreamCompiler.execute(graph, {
    telemetryStream$: telemetry$,

    sendAlert: alert => {
      console.log("\nALERT CALLBACK RECEIVED:");
      console.log(alert.message);
      console.log("Processed value:", alert.value);
    },

    onData: event => {
      console.log("Final pipeline output:", event.value);
    },

    onError: error => {
      console.error("Pipeline error:", error.message);
    }
  });

  const readings = [70, 80, 90, 100, 110];

  readings.forEach(value => {
    console.log(`Publishing telemetry: ${value}`);

    telemetry$.next({
      deviceId: "TURBINE-001",
      metric: "temperature",
      value,
      timestamp: new Date()
    });
  });

  subscription.unsubscribe();
  telemetry$.complete();

  console.log("\nPipeline Builder Test Completed.");

} catch (error) {
  console.error("Test failed:", error.message);

  if (error.validationErrors) {
    console.error(error.validationErrors);
  }

  process.exitCode = 1;
}

