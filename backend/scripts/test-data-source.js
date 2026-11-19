const { Subject } = require("rxjs");
const StreamCompiler = require("../services/streamCompiler.service");

// Create an isolated telemetry stream for testing.
const testSubject = new Subject();

// Sample graph containing one Sensor node.
const graph = {
  name: "Turbine Sensor Test",

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
    }
  ],

  edges: []
};

try {
  // Compile the graph and subscribe to its output.
  const pipeline = StreamCompiler.compile(graph, {
    telemetryStream$: testSubject.asObservable()
  });

  const subscription = pipeline.subscribe({
    next: (data) => {
      console.log("Sensor Data Received:", data);
    },
    error: (error) => {
      console.error("Pipeline Error:", error.message);
    }
  });

  console.log("\nPublishing telemetry events...\n");

  // Matching device and metric: should be received.
  testSubject.next({
    deviceId: "TURBINE-001",
    metric: "temperature",
    value: 85,
    timestamp: new Date()
  });

  // Wrong device: should be ignored.
  testSubject.next({
    deviceId: "TURBINE-002",
    metric: "temperature",
    value: 90,
    timestamp: new Date()
  });

  // Wrong metric: should be ignored.
  testSubject.next({
    deviceId: "TURBINE-001",
    metric: "pressure",
    value: 40,
    timestamp: new Date()
  });

  // Matching device and metric: should be received.
  testSubject.next({
    deviceId: "TURBINE-001",
    metric: "temperature",
    value: 95,
    timestamp: new Date()
  });

  subscription.unsubscribe();
  testSubject.complete();

} catch (error) {
  console.error("Test Failed:", error.message);
}
