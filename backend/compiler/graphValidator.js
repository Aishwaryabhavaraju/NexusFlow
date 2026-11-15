const {
  NODE_TYPES,
  SUPPORTED_NODE_TYPES
} = require("./compiler.constants");

const validateCompilerGraph = (parsedGraph) => {
  const {
    nodes,
    incomingEdges
  } = parsedGraph;

  if (nodes.length === 0) {
    throw new Error("Graph must contain at least one node");
  }

  const ids = new Set();

  nodes.forEach((node) => {
    if (!node.id || ids.has(node.id)) {
      throw new Error(`Missing or duplicate node ID: ${node.id}`);
    }

    ids.add(node.id);

    if (!SUPPORTED_NODE_TYPES.includes(node.type)) {
      throw new Error(`Unsupported node type: ${node.type}`);
    }

    if (!node.data || typeof node.data !== "object") {
      throw new Error(`Invalid data for node: ${node.id}`);
    }
  });

  const sourceNodes = nodes.filter(
    (node) => node.type === NODE_TYPES.SENSOR
  );

  if (sourceNodes.length !== 1) {
    throw new Error("MVP compiler requires exactly one sensor node");
  }

  for (const node of nodes) {
    const inputCount = incomingEdges.get(node.id).length;

    if (node.type === NODE_TYPES.SENSOR && inputCount !== 0) {
      throw new Error("Sensor node cannot have incoming edges");
    }

    if (node.type !== NODE_TYPES.SENSOR && inputCount !== 1) {
      throw new Error(
        `Node ${node.id} must have exactly one incoming edge`
      );
    }
  }

  // Validate node-specific configuration
  for (const node of nodes) {
    const data = node.data;

    if (node.type === NODE_TYPES.SENSOR) {
      if (!data.deviceId || !data.metric) {
        throw new Error(
          `Sensor ${node.id} requires deviceId and metric`
        );
      }
    }

    if (node.type === NODE_TYPES.MOVING_AVERAGE) {
      if (
        !Number.isInteger(data.windowSize) ||
        data.windowSize < 1
      ) {
        throw new Error(
          `Moving average node ${node.id} requires windowSize >= 1`
        );
      }
    }

    if (node.type === NODE_TYPES.MATH_OPERATION) {
      const allowed = ["add", "subtract", "multiply", "divide"];

      if (!allowed.includes(data.operation)) {
        throw new Error(
          `Invalid math operation in node ${node.id}`
        );
      }

      if (typeof data.operand !== "number") {
        throw new Error(
          `Math node ${node.id} requires a numeric operand`
        );
      }
    }

    if (node.type === NODE_TYPES.THRESHOLD) {
      const allowed = ["gt", "gte", "lt", "lte", "eq"];

      if (
        !allowed.includes(data.operator) ||
        typeof data.value !== "number"
      ) {
        throw new Error(
          `Threshold node ${node.id} requires a valid operator and value`
        );
      }
    }

    if (node.type === NODE_TYPES.SMS_ALERT) {
      if (!data.message) {
        throw new Error(
          `SMS alert node ${node.id} requires a message`
        );
      }
    }
  }
};

module.exports = validateCompilerGraph;
