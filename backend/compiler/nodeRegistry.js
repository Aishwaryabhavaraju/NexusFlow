const {
  filter,
  map,
  scan,
  tap
} = require("rxjs/operators");

const {
  NODE_TYPES
} = require("./compiler.constants");

// Sensor node: creates a stream for one device and metric.
const createSensorStream = (node, context) => {
  const { deviceId, metric } = node.data || {};
  const telemetryStream$ = context.telemetryStream$;

  if (!deviceId || !metric) {
    throw new Error(
      `Sensor node ${node.id} requires deviceId and metric`
    );
  }

  if (!telemetryStream$) {
    throw new Error("Telemetry stream is not configured");
  }

  return telemetryStream$.pipe(
    // Accept events from the configured device only.
    filter((event) => event.deviceId === deviceId),

    // Accept the configured sensor metric only.
    filter((event) => event.metric === metric),

    // Convert the event into the pipeline data format.
    map((event) => ({
      deviceId: event.deviceId,
      metric: event.metric,
      value: event.value,
      timestamp: event.timestamp
    }))
  );
};

// Moving average node: rolling average with rolling sum
const createMovingAverage = (node) => {
  const { windowSize } = node.data || {};

  if (
    !Number.isInteger(windowSize) ||
    windowSize < 1 ||
    windowSize > 10000
  ) {
    throw new Error(
      `Moving Average node ${node.id} requires a valid windowSize`
    );
  }

  return (source$) =>
    source$.pipe(
      scan(
        (state, event) => {
          const values = [...state.values, event.value];

          let sum = state.sum + event.value;

          if (values.length > windowSize) {
            const removedValue = values.shift();
            sum -= removedValue;
          }

          return {
            values,
            sum,
            latestEvent: event
          };
        },
        {
          values: [],
          sum: 0,
          latestEvent: null
        }
      ),

      map((state) => ({
        ...state.latestEvent,
        rawValue: state.latestEvent.value,
        value: state.sum / state.values.length,
        windowSize: state.values.length
      }))
    );
};

// Math Operation node: addition, subtraction, multiplication, division
const createMathOperation = (node) => {
  const { operation, operand } = node.data || {};

  const supportedOperations = [
    "add",
    "subtract",
    "multiply",
    "divide"
  ];

  if (!supportedOperations.includes(operation)) {
    throw new Error(
      `Unsupported math operation: ${operation}`
    );
  }

  if (typeof operand !== "number" ||
      !Number.isFinite(operand)) {
    throw new Error(
      `Math node ${node.id} requires a valid numeric operand`
    );
  }

  if (operation === "divide" && operand === 0) {
    throw new Error("Division by zero is not allowed");
  }

  return (source$) =>
    source$.pipe(
      map((event) => {
        let result;

        switch (operation) {
          case "add":
            result = event.value + operand;
            break;

          case "subtract":
            result = event.value - operand;
            break;

          case "multiply":
            result = event.value * operand;
            break;

          case "divide":
            result = event.value / operand;
            break;
        }

        if (!Number.isFinite(result)) {
          throw new Error("Math operation produced an invalid result");
        }

        return {
          ...event,
          value: result
        };
      })
    );
};

// Threshold node: gt, gte, lt, lte, eq comparison
const createThreshold = (node) => {
  const { operator, value } = node.data || {};

  const supportedOperators = [
    "gt",
    "gte",
    "lt",
    "lte",
    "eq"
  ];

  if (!supportedOperators.includes(operator)) {
    throw new Error(
      `Unsupported threshold operator: ${operator}`
    );
  }

  if (typeof value !== "number" ||
      !Number.isFinite(value)) {
    throw new Error(
      `Threshold node ${node.id} requires a valid numeric value`
    );
  }

  return (source$) =>
    source$.pipe(
      filter((event) => {
        switch (operator) {
          case "gt":
            return event.value > value;

          case "gte":
            return event.value >= value;

          case "lt":
            return event.value < value;

          case "lte":
            return event.value <= value;

          case "eq":
            return event.value === value;

          default:
            return false;
        }
      })
    );
};

// SMS alert side-effect operator
const createSmsAlert = (node, context = {}) => {
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

// Action Trigger node: evaluates rule condition and triggers alert events
const createActionTrigger = (node, context = {}) => {
  const {
    actionType = "alert",
    message
  } = node.data || {};

  const supportedActions = ["alert"];

  if (!supportedActions.includes(actionType)) {
    throw new Error(
      `Unsupported action type: ${actionType}`
    );
  }

  if (typeof message !== "string" || !message.trim()) {
    throw new Error(
      `Action Trigger node ${node.id} requires a message`
    );
  }

  return (source$) =>
    source$.pipe(
      tap((event) => {
        // The Threshold node forwards only matching events.
        const alertEvent = {
          type: "ALERT_TRIGGERED",
          actionType,
          nodeId: node.id,
          deviceId: event.deviceId,
          metric: event.metric,
          value: event.value,
          timestamp: event.timestamp,
          message
        };

        console.log("\nACTION TRIGGERED!");
        console.log(alertEvent);

        // Send the alert to the configured alert handler.
        if (typeof context.sendAlert === "function") {
          context.sendAlert(alertEvent);
        }
      })
    );
};

const nodeRegistry = {
  sensor: createSensorStream,
  movingAverage: createMovingAverage,
  mathOperation: createMathOperation,
  threshold: createThreshold,
  smsAlert: createSmsAlert,
  actionTrigger: createActionTrigger
};

// Convert a visual node into an RxJS source or operator
const buildNode = (node, context = {}) => {
  const handler = nodeRegistry[node.type];
  if (!handler) {
    throw new Error(`Unsupported node type: ${node.type}`);
  }
  return handler(node, context);
};

nodeRegistry.buildNode = buildNode;

module.exports = nodeRegistry;
