const { filter, map } = require("rxjs/operators");

const createSensorStream = (node, context = {}) => {
  const { deviceId, metric } = node.data || {};

  if (!deviceId || !metric) {
    throw new Error("Sensor requires deviceId and metric");
  }

  const telemetryStream$ = context.telemetryStream$;

  if (!telemetryStream$) {
    throw new Error("Telemetry stream is not available");
  }

  return telemetryStream$.pipe(
    filter(event => event.deviceId === deviceId),

    filter(event => event.metric === metric),

    map(event => ({
      deviceId: event.deviceId,
      metric: event.metric,
      value: event.value,
      timestamp: event.timestamp
    }))
  );
};

module.exports = createSensorStream;

