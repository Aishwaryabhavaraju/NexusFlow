const { Subject } = require("rxjs");
const StreamCompiler = require("../services/streamCompiler.service");

const telemetrySubject = new Subject();

const graph = {
  name: "Turbine Math and Threshold Test",

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
        label: "Multiply by 2",
        operation: "multiply",
        operand: 2
      }
    },
    {
      id: "threshold-1",
      type: "threshold",
      position: { x: 500, y: 150 },
      data: {
        label: "Temperature Threshold",
        operator: "gte",
        value: 150
      }
    },
    {
      id: "alert-1",
      type: "smsAlert",
      position: { x: 700, y: 150 },
      data: {
        label: "SMS Alert",
        message: "Temperature limit exceeded!"
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
      target: "alert-1"
    }
  ]
};

try {
  const pipeline = StreamCompiler.compile(graph, {
    telemetryStream$: telemetrySubject.asObservable(),

    sendAlert: (alert) => {
      console.log("MOCK SMS ALERT:", alert);
    }
  });

  const subscription = pipeline.subscribe({
    next: (data) => {
      console.log("Pipeline Output:", data);
    },
    error: (error) => {
      console.error("Pipeline Error:", error.message);
    }
  });

  console.log("\nPublishing sensor readings...\n");

  const readings = [60, 70, 80, 90];

  readings.forEach((temperature) => {
    console.log("Original Temperature:", temperature);

    telemetrySubject.next({
      deviceId: "TURBINE-001",
      metric: "temperature",
      value: temperature,
      timestamp: new Date()
    });
  });

  subscription.unsubscribe();
  telemetrySubject.complete();

} catch (error) {
  console.error("Test Failed:", error.message);

  if (error.validationErrors) {
    console.error(error.validationErrors);
  }
}
