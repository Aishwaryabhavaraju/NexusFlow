const { interval } = require("rxjs");
const { take, map } = require("rxjs/operators");

const {
  publishTelemetry,
  processedTelemetry$,
  telemetrySubject
} = require("../services/telemetryStream.service");

// Subscribe to the processed stream
const subscription = processedTelemetry$.subscribe({
  next: (data) => {
    console.log("Final output:", data);
  },

  error: (error) => {
    console.error("Stream error:", error);
  },

  complete: () => {
    console.log("Stream completed");
  }
});

// Generate four mock sensor readings
const sensor = interval(1000).pipe(
  take(4),

  map((index) => ({
    deviceId: "TURBINE-001",
    timestamp: new Date(),
    measurements: {
      temperature: 70 + index * 5,
      pressure: 110 + index * 2
    }
  }))
);

// Publish each reading to the Subject
const sensorSubscription = sensor.subscribe({
  next: (reading) => {
    console.log("\nNew sensor reading:", reading);
    publishTelemetry(reading);
  },

  complete: () => {
    console.log("\nAll sensor readings generated");

    telemetrySubject.complete();
    subscription.unsubscribe();
  }
});

