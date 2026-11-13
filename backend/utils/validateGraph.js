const {
  NODE_TYPES,
  DEFAULT_GRAPH_CONFIG
} = require("../constants/graph.constants");

const validateGraph = (graph) => {
  if (!graph || typeof graph !== "object") {
    return "Graph data must be an object";
  }

  if (!graph.name || typeof graph.name !== "string") {
    return "Graph name is required";
  }

  if (!Array.isArray(graph.nodes) || graph.nodes.length === 0) {
    return "Graph must contain at least one node";
  }

  if (!Array.isArray(graph.edges)) {
    return "Edges must be an array";
  }

  const allowedTypes = Object.values(NODE_TYPES);
  const nodeIds = new Set();

  // Validate nodes
  for (const node of graph.nodes) {
    if (!node.id || !node.type || !node.position || !node.data) {
      return "Every node must contain id, type, position and data";
    }

    if (nodeIds.has(node.id)) {
      return `Duplicate node ID: ${node.id}`;
    }

    nodeIds.add(node.id);

    if (!allowedTypes.includes(node.type)) {
      return `Unsupported node type: ${node.type}`;
    }

    if (
      typeof node.position.x !== "number" ||
      typeof node.position.y !== "number"
    ) {
      return `Invalid position for node: ${node.id}`;
    }

    if (typeof node.data !== "object" || node.data === null) {
      return `Invalid data for node: ${node.id}`;
    }
  }

  // Validate edges
  const edgeIds = new Set();

  for (const edge of graph.edges) {
    if (!edge.id || !edge.source || !edge.target) {
      return "Every edge must contain id, source and target";
    }

    if (edgeIds.has(edge.id)) {
      return `Duplicate edge ID: ${edge.id}`;
    }

    edgeIds.add(edge.id);

    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      return `Edge ${edge.id} refers to a node that does not exist`;
    }

    if (edge.source === edge.target) {
      return `Edge ${edge.id} cannot connect a node to itself`;
    }
  }

  // Validate graph configuration
  const config = {
    ...DEFAULT_GRAPH_CONFIG,
    ...(graph.config || {})
  };

  if (config.version !== "1.0") {
    return "Unsupported graph configuration version";
  }

  if (config.executionMode !== "realtime") {
    return "Unsupported execution mode";
  }

  if (typeof config.isEnabled !== "boolean") {
    return "config.isEnabled must be true or false";
  }

  return null;
};

module.exports = validateGraph;

