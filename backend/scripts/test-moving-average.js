const { Subject } = require("rxjs");
const StreamCompiler = require("../services/streamCompiler.service");

const telemetrySubject = new Subject();

const graph = {
  name: "Turbine Moving Average Test",

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
        windowSize: 3
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
      id: "alert-1",
      type: "smsAlert",
      position: { x: 700, y: 150 },
      data: {
        label: "SMS Alert",
        message: "Average temperature reached the limit!"
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
  const pipeline = StreamCompiler.compile(graph, {
    telemetryStream$: telemetrySubject.asObservable(),

    sendAlert: (alert) => {
      console.log("MOCK SMS ALERT:", alert);
    }
  });

  const subscription = pipeline.subscribe({
    next: (data) => {
      console.log(
        `Moving Average: ${data.value}`
      );
    },

    error: (error) => {
      console.error("Pipeline Error:", error.message);
    }
  });

  console.log("\nPublishing temperature readings...\n");

  const readings = [60, 70, 80, 90, 100];

  readings.forEach((temperature) => {
    console.log("Sensor Input:", temperature);

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
