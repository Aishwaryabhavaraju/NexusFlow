const {
  NODE_TYPES,
  SUPPORTED_NODE_TYPES
} = require("./compiler.constants");

const validateGraph = (parsedGraph) => {
  const {
    nodes,
    edges,
    nodeMap,
    incomingEdges,
    outgoingEdges,
    sourceNodes,
    terminalNodes
  } = parsedGraph;

  const errors = [];

  // 1. Validate graph is not empty
  if (nodes.length === 0) {
    errors.push("Graph must contain at least one node");
  }

  if (nodes.length > 100) {
    errors.push("Graph cannot contain more than 100 nodes");
  }

  // 2. Validate node IDs, types, positions and data
  const nodeIds = new Set();

  for (const node of nodes) {
    if (
      typeof node.id !== "string" ||
      !node.id.trim()
    ) {
      errors.push("Every node must have a non-empty string ID");
      continue;
    }

    if (nodeIds.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    }

    nodeIds.add(node.id);

    if (!SUPPORTED_NODE_TYPES.includes(node.type)) {
      errors.push(
        `Unsupported node type '${node.type}' in node ${node.id}`
      );
    }

    if (
      !node.position ||
      !Number.isFinite(node.position.x) ||
      !Number.isFinite(node.position.y)
    ) {
      errors.push(`Invalid position for node ${node.id}`);
    }

    if (
      !node.data ||
      typeof node.data !== "object" ||
      Array.isArray(node.data)
    ) {
      errors.push(`Invalid data configuration for node ${node.id}`);
    }
  }

  // 3. Validate edge IDs and connections
  const edgeIds = new Set();

  for (const edge of edges) {
    if (
      typeof edge.id !== "string" ||
      !edge.id.trim()
    ) {
      errors.push("Every edge must have a non-empty string ID");
    } else if (edgeIds.has(edge.id)) {
      errors.push(`Duplicate edge ID: ${edge.id}`);
    } else {
      edgeIds.add(edge.id);
    }

    if (!nodeMap.has(edge.source)) {
      errors.push(`Edge ${edge.id} has an invalid source`);
      continue;
    }

    if (!nodeMap.has(edge.target)) {
      errors.push(`Edge ${edge.id} has an invalid target`);
      continue;
    }

    if (edge.source === edge.target) {
      errors.push(`Self-connection detected in edge ${edge.id}`);
    }
  }

  // 4. Validate graph configuration
  const config = parsedGraph.config;

  if (config.version !== "1.0") {
    errors.push("Unsupported graph version. Expected 1.0");
  }

  if (config.executionMode !== "realtime") {
    errors.push("Unsupported execution mode");
  }

  if (typeof config.isEnabled !== "boolean") {
    errors.push("config.isEnabled must be a boolean");
  }

  // 5. Validate source nodes
  const sensors = nodes.filter(
    (node) => node.type === NODE_TYPES.SENSOR
  );

  if (sensors.length !== 1) {
    errors.push("MVP compiler requires exactly one sensor node");
  }

  for (const node of nodes) {
    if (!node.id || !nodeMap.has(node.id)) {
      continue;
    }

    const inputCount = incomingEdges.get(node.id).length;
    const outputCount = outgoingEdges.get(node.id).length;

    if (
      node.type === NODE_TYPES.SENSOR &&
      inputCount !== 0
    ) {
      errors.push(`Sensor ${node.id} cannot have incoming edges`);
    }

    if (
      node.type !== NODE_TYPES.SENSOR &&
      inputCount !== 1
    ) {
      errors.push(
        `Node ${node.id} must have exactly one incoming edge`
      );
    }

    if (
      node.type === NODE_TYPES.SMS_ALERT &&
      outputCount !== 0
    ) {
      errors.push(`SMS alert ${node.id} must be a terminal node`);
    }
  }

  // 6. Validate that the graph has a terminal node
  if (nodes.length > 0 && terminalNodes.length === 0) {
    errors.push("Graph must contain at least one terminal node");
  }

  // 7. Validate node-specific configurations
  for (const node of nodes) {
    const data = node.data;

    if (!data || typeof data !== "object") {
      continue;
    }

    switch (node.type) {
      case NODE_TYPES.SENSOR:
        if (
          typeof data.deviceId !== "string" ||
          !data.deviceId.trim()
        ) {
          errors.push(
            `Sensor ${node.id} requires a valid deviceId`
          );
        }

        if (
          typeof data.metric !== "string" ||
          !data.metric.trim()
        ) {
          errors.push(
            `Sensor ${node.id} requires a valid metric`
          );
        }
        break;

      case NODE_TYPES.MOVING_AVERAGE:
        if (
          !Number.isInteger(data.windowSize) ||
          data.windowSize < 1 ||
          data.windowSize > 10000
        ) {
          errors.push(
            `Moving average ${node.id} requires windowSize between 1 and 10000`
          );
        }
        break;

      case NODE_TYPES.MATH_OPERATION: {
        const operations = [
          "add",
          "subtract",
          "multiply",
          "divide"
        ];

        if (!operations.includes(data.operation)) {
          errors.push(
            `Math node ${node.id} has an invalid operation`
          );
        }

        if (!Number.isFinite(data.operand)) {
          errors.push(
            `Math node ${node.id} requires a numeric operand`
          );
        }

        if (
          data.operation === "divide" &&
          data.operand === 0
        ) {
          errors.push(
            `Math node ${node.id} cannot divide by zero`
          );
        }
        break;
      }

      case NODE_TYPES.THRESHOLD: {
        const operators = ["gt", "gte", "lt", "lte", "eq"];

        if (!operators.includes(data.operator)) {
          errors.push(
            `Threshold node ${node.id} has an invalid operator`
          );
        }

        if (!Number.isFinite(data.value)) {
          errors.push(
            `Threshold node ${node.id} requires a numeric value`
          );
        }
        break;
      }

      case NODE_TYPES.SMS_ALERT:
        if (
          typeof data.message !== "string" ||
          !data.message.trim()
        ) {
          errors.push(
            `SMS alert ${node.id} requires a message`
          );
        }
        break;

      case NODE_TYPES.ACTION_TRIGGER: {
        const { actionType = "alert", message } = node.data;

        if (actionType !== "alert") {
          errors.push(
            `Action Trigger node ${node.id} has an unsupported action type`
          );
        }

        if (typeof message !== "string" || !message.trim()) {
          errors.push(
            `Action Trigger node ${node.id} requires a non-empty message`
          );
        }

        break;
      }

      default:
        // Unsupported types are already reported above.
        break;
    }
  }

  // 8. Detect cycles using Kahn's algorithm
  const inDegree = new Map();

  for (const node of nodes) {
    inDegree.set(
      node.id,
      incomingEdges.get(node.id).length
    );
  }

  const queue = nodes
    .filter((node) => inDegree.get(node.id) === 0)
    .map((node) => node.id);

  let visitedCount = 0;

  while (queue.length > 0) {
    const currentId = queue.shift();
    visitedCount++;

    for (const edge of outgoingEdges.get(currentId)) {
      const targetId = edge.target;

      inDegree.set(
        targetId,
        inDegree.get(targetId) - 1
      );

      if (inDegree.get(targetId) === 0) {
        queue.push(targetId);
      }
    }
  }

  if (visitedCount !== nodes.length) {
    errors.push("Circular connection detected in graph");
  }

  // 9. Verify all nodes are reachable from the sensor
  if (sensors.length === 1) {
    const visited = new Set();
    const stack = [sensors[0].id];

    while (stack.length > 0) {
      const currentId = stack.pop();

      if (visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);

      for (const edge of outgoingEdges.get(currentId) || []) {
        stack.push(edge.target);
      }
    }

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        errors.push(
          `Node ${node.id} is disconnected from the sensor`
        );
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = validateGraph;
