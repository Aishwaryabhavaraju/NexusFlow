const { Subject } = require("rxjs");
const { map, tap } = require("rxjs/operators");

// Shared Subject receives telemetry events
const telemetrySubject = new Subject();

// Expose the Subject as a read-only Observable
const telemetryStream$ = telemetrySubject.asObservable();

// Publish one or more normalized telemetry events
const publishTelemetry = (input) => {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid telemetry input");
  }

  const { deviceId } = input;

  if (
    typeof deviceId !== "string" ||
    !deviceId.trim()
  ) {
    throw new Error("Valid deviceId is required");
  }

  const timestamp = input.timestamp
    ? new Date(input.timestamp)
    : new Date();

  if (Number.isNaN(timestamp.getTime())) {
    throw new Error("Invalid telemetry timestamp");
  }

  const events = [];

  // Format 1: Single metric reading
  if (typeof input.metric === "string") {
    if (
      typeof input.value !== "number" ||
      !Number.isFinite(input.value)
    ) {
      throw new Error("Telemetry value must be a finite number");
    }

    events.push({
      deviceId: deviceId.trim(),
      metric: input.metric.trim(),
      value: input.value,
      timestamp
    });
  }

  // Format 2: Multiple measurements
  else if (
    input.measurements &&
    typeof input.measurements === "object" &&
    !Array.isArray(input.measurements)
  ) {
    for (const [metric, value] of Object.entries(input.measurements)) {
      if (!metric.trim()) continue;

      if (
        typeof value !== "number" ||
        !Number.isFinite(value)
      ) {
        continue;
      }

      events.push({
        deviceId: deviceId.trim(),
        metric,
        value,
        timestamp
      });
    }

    if (events.length === 0) {
      throw new Error("No valid telemetry measurements provided");
    }
  } else {
    throw new Error("Provide metric/value or measurements");
  }

  // Broadcast every normalized event
  events.forEach(event => {
    telemetrySubject.next(event);
  });

  return events;
};

// Process telemetry events
const processedTelemetry$ = telemetryStream$.pipe(
  map(event => ({
    ...event,
    measurements: {
      [event.metric]: event.value
    }
  })),

  tap(event => {
    console.log("Telemetry published:", event);
  })
);

module.exports = {
  publishTelemetry,
  telemetrySubject,
  telemetryStream$,
  processedTelemetry$
};
