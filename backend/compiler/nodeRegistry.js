const {
  filter,
  map,
  scan,
  tap
} = require("rxjs/operators");

const {
  NODE_TYPES
} = require("./compiler.constants");

// Build the sensor source Observable
const buildSensorSource = (node, telemetryStream$) => {
  const { deviceId, metric } = node.data;

  return telemetryStream$.pipe(
    filter((reading) => {
      return (
        reading.deviceId === deviceId &&
        reading.measurements &&
        Number.isFinite(reading.measurements[metric])
      );
    }),

    map((reading) => ({
      deviceId: reading.deviceId,
      metric,
      value: reading.measurements[metric],
      timestamp: reading.timestamp || new Date()
    }))
  );
};

// Build a moving average operator
const buildMovingAverage = (node) => {
  const windowSize = node.data.windowSize;

  return (source$) =>
    source$.pipe(
      scan((state, reading) => {
        const values = [
          ...state.values,
          reading.value
        ].slice(-windowSize);

        const average =
          values.reduce((sum, value) => sum + value, 0) /
          values.length;

        return {
          values,
          reading: {
            ...reading,
            value: average
          }
        };
      }, {
        values: [],
        reading: null
      }),

      map((state) => state.reading)
    );
};

// Build mathematical operation
const buildMathOperation = (node) => {
  const { operation, operand } = node.data;

  return (source$) =>
    source$.pipe(
      map((reading) => {
        let result;

        switch (operation) {
          case "add":
            result = reading.value + operand;
            break;

          case "subtract":
            result = reading.value - operand;
            break;

          case "multiply":
            result = reading.value * operand;
            break;

          case "divide":
            if (operand === 0) {
              throw new Error("Division by zero");
            }
            result = reading.value / operand;
            break;

          default:
            throw new Error("Unsupported math operation");
        }

        return {
          ...reading,
          value: result
        };
      })
    );
};

// Build threshold filter
const buildThreshold = (node) => {
  const { operator, value } = node.data;

  return (source$) =>
    source$.pipe(
      filter((reading) => {
        switch (operator) {
          case "gt":
            return reading.value > value;

          case "gte":
            return reading.value >= value;

          case "lt":
            return reading.value < value;

          case "lte":
            return reading.value <= value;

          case "eq":
            return reading.value === value;

          default:
            return false;
        }
      })
    );
};

// Build SMS alert side-effect operator
const buildSmsAlert = (node, context = {}) => {
  return (source$) =>
    source$.pipe(
      tap((reading) => {
        const alert = {
          nodeId: node.id,
          message: node.data.message,
          deviceId: reading.deviceId,
          value: reading.value,
          timestamp: new Date()
        };

        if (context.sendAlert) {
          context.sendAlert(alert);
        } else {
          console.log("NEXUSFLOW ALERT:", alert);
        }
      })
    );
};

// Convert a visual node into an RxJS source or operator
const buildNode = (node, context = {}) => {
  switch (node.type) {
    case NODE_TYPES.SENSOR:
      return buildSensorSource(
        node,
        context.telemetryStream$
      );

    case NODE_TYPES.MOVING_AVERAGE:
      return buildMovingAverage(node);

    case NODE_TYPES.MATH_OPERATION:
      return buildMathOperation(node);

    case NODE_TYPES.THRESHOLD:
      return buildThreshold(node);

    case NODE_TYPES.SMS_ALERT:
      return buildSmsAlert(node, context);

    default:
      throw new Error(`Unsupported node type: ${node.type}`);
  }
};

module.exports = {
  buildNode
};
