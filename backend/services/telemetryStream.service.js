const { Subject } = require("rxjs");
const { filter, map, tap } = require("rxjs/operators");

// Create a central telemetry stream
const telemetrySubject = new Subject();

// Convert Subject into an Observable
const telemetryStream$ = telemetrySubject.asObservable();

// Publish telemetry data
const publishTelemetry = (telemetry) => {
  telemetrySubject.next(telemetry);
};

// Process incoming telemetry
const processedTelemetry$ = telemetryStream$.pipe(
  // Accept only valid telemetry readings
  filter((data) => {
    return (
      data &&
      data.deviceId &&
      data.measurements &&
      typeof data.measurements === "object"
    );
  }),

  // Transform the telemetry data
  map((data) => ({
    deviceId: data.deviceId,
    timestamp: data.timestamp || new Date(),
    temperature: data.measurements.temperature,
    pressure: data.measurements.pressure
  })),

  // Log processed telemetry
  tap((data) => {
    console.log("Processed telemetry:", data);
  })
);

module.exports = {
  publishTelemetry,
  telemetryStream$,
  processedTelemetry$,
  telemetrySubject
};

