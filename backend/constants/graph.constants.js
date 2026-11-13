const NODE_TYPES = {
  SENSOR: "sensor",
  MOVING_AVERAGE: "movingAverage",
  MATH_OPERATION: "mathOperation",
  THRESHOLD: "threshold",
  SMS_ALERT: "smsAlert"
};

const DEFAULT_GRAPH_CONFIG = {
  version: "1.0",
  executionMode: "realtime",
  isEnabled: true
};

const EDGE_TYPES = {
  DEFAULT: "smoothstep",
  STRAIGHT: "straight",
  STEP: "step"
};

module.exports = {
  NODE_TYPES,
  DEFAULT_GRAPH_CONFIG,
  EDGE_TYPES
};

