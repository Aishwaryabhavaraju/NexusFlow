const { Subject } = require("rxjs");

const streamCompiler = require("../services/streamCompiler.service");

// Create a test telemetry source
const testTelemetry$ = new Subject();

// Sample React Flow graph
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
        windowSize: 2
      }
    },
    {
      id: "threshold-1",
      type: "threshold",
      position: { x: 500, y: 150 },
      data: {
        label: "Temperature Threshold",
        operator: "gte",
        value: 85
      }
    },
    {
      id: "alert-1",
      type: "smsAlert",
      position: { x: 700, y: 150 },
      data: {
        label: "SMS Alert",
        message: "Turbine temperature exceeded 85 degrees!"
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

// Compile and execute the graph
const subscription = streamCompiler.execute(graph, {
  telemetryStream$: testTelemetry$,

  sendAlert: (alert) => {
    console.log("\nMOCK SMS ALERT:", alert.message);
    console.log("Device:", alert.deviceId);
    console.log("Value:", alert.value);
  },

  onData: (data) => {
    console.log("Final pipeline data:", data);
  }
});

// Simulate incoming sensor readings
const readings = [70, 90, 100, 80];

readings.forEach((temperature, index) => {
  setTimeout(() => {
    console.log("\nNew temperature:", temperature);

    testTelemetry$.next({
      deviceId: "TURBINE-001",
      metric: "temperature",
      value: temperature,
      timestamp: new Date()
    });

    // Complete the test after the last reading
    if (index === readings.length - 1) {
      setTimeout(() => {
        subscription.unsubscribe();
        testTelemetry$.complete();
        console.log("\nTest completed");
      }, 100);
    }
  }, index * 1000);
});
