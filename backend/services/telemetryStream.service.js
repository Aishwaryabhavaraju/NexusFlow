const { Subject } = require("rxjs");
const { map, tap } = require("rxjs/operators");

// Receives raw IoT telemetry events.
const telemetrySubject = new Subject();

// Read-only stream consumed by the Stream Compiler.
const telemetryStream$ = telemetrySubject.asObservable();

/**
 * Publishes telemetry in a standard event format:
 * {
 *   deviceId: "TURBINE-001",
 *   metric: "temperature",
 *   value: 85,
 *   timestamp: Date
 * }
 *
 * Also supports the older measurements format:
 * { deviceId, measurements: { temperature, pressure } }
 */
const publishTelemetry = (input) => {
  if (!input || typeof input.deviceId !== "string" ||
      !input.deviceId.trim()) {
    throw new Error("A valid deviceId is required");
  }

  const timestamp = input.timestamp
    ? new Date(input.timestamp)
    : new Date();

  if (Number.isNaN(timestamp.getTime())) {
    throw new Error("Invalid telemetry timestamp");
  }

  // Standard single-metric event.
  if (typeof input.metric === "string") {
    if (typeof input.value !== "number" ||
        !Number.isFinite(input.value)) {
      throw new Error("Telemetry value must be a finite number");
    }

    telemetrySubject.next({
      deviceId: input.deviceId,
      metric: input.metric,
      value: input.value,
      timestamp
    });

    return;
  }

  // Backward compatibility with the earlier measurements format.
  if (input.measurements &&
      typeof input.measurements === "object" &&
      !Array.isArray(input.measurements)) {

    for (const [metric, value] of Object.entries(input.measurements)) {
      if (typeof value !== "number" || !Number.isFinite(value)) {
        continue;
      }

      telemetrySubject.next({
        deviceId: input.deviceId,
        metric,
        value,
        timestamp
      });
    }

    return;
  }

  throw new Error("Provide metric/value or a measurements object");
};

// General-purpose processed telemetry stream.
const processedTelemetry$ = telemetryStream$.pipe(
  map((event) => ({
    deviceId: event.deviceId,
    timestamp: event.timestamp,
    metric: event.metric,
    value: event.value,
    measurements: {
      [event.metric]: event.value
    }
  })),
  tap((event) => {
    console.log("Processed telemetry:", event);
  })
);

module.exports = {
  publishTelemetry,
  telemetrySubject,
  telemetryStream$,
  processedTelemetry$
};
