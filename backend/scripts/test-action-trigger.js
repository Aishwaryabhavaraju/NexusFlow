const { Subject } = require("rxjs");
const StreamCompiler = require("../services/streamCompiler.service");

const telemetrySubject = new Subject();

const graph = {
  name: "Turbine Action Trigger Test",

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
      id: "threshold-1",
      type: "threshold",
      position: { x: 350, y: 150 },
      data: {
        label: "Temperature Threshold",
        operator: "gte",
        value: 80
      }
    },
    {
      id: "action-1",
      type: "actionTrigger",
      position: { x: 600, y: 150 },
      data: {
        label: "Action Trigger",
        actionType: "alert",
        message: "Turbine temperature exceeded the safe limit!"
      }
    }
  ],

  edges: [
    {
      id: "edge-1",
      source: "sensor-1",
      target: "threshold-1"
    },
    {
      id: "edge-2",
      source: "threshold-1",
      target: "action-1"
    }
  ]
};

try {
  const pipeline = StreamCompiler.compile(graph, {
    telemetryStream$: telemetrySubject.asObservable(),

    sendAlert: (alert) => {
      console.log("\nMOCK ALERT EVENT:");
      console.log("Type:", alert.type);
      console.log("Device:", alert.deviceId);
      console.log("Metric:", alert.metric);
      console.log("Value:", alert.value);
      console.log("Message:", alert.message);
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

  const readings = [60, 75, 80, 90, 65, 100];

  readings.forEach((temperature) => {
    console.log("Sensor Reading:", temperature);

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
