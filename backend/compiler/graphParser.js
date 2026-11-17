// backend/compiler/graphParser.js

const parseGraph = (graph) => {
  // Check the basic graph structure
  if (!graph || typeof graph !== "object" || Array.isArray(graph)) {
    throw new Error("Graph must be a valid JSON object");
  }

  if (!Array.isArray(graph.nodes)) {
    throw new Error("Graph nodes must be an array");
  }

  if (!Array.isArray(graph.edges)) {
    throw new Error("Graph edges must be an array");
  }

  // Create lookup maps
  const nodeMap = new Map();
  const incomingEdges = new Map();
  const outgoingEdges = new Map();

  // Register nodes
  for (const node of graph.nodes) {
    if (!node || typeof node !== "object" || Array.isArray(node)) {
      throw new Error("Every graph node must be an object");
    }

    if (typeof node.id !== "string" || !node.id.trim()) {
      throw new Error("Every node must have a non-empty string ID");
    }

    if (nodeMap.has(node.id)) {
      throw new Error(`Duplicate node ID: ${node.id}`);
    }

    nodeMap.set(node.id, node);
    incomingEdges.set(node.id, []);
    outgoingEdges.set(node.id, []);
  }

  // Register edges
  for (const edge of graph.edges) {
    if (!edge || typeof edge !== "object" || Array.isArray(edge)) {
      throw new Error("Every graph edge must be an object");
    }

    if (
      typeof edge.source !== "string" ||
      typeof edge.target !== "string"
    ) {
      throw new Error("Every edge must have string source and target IDs");
    }

    if (!nodeMap.has(edge.source)) {
      throw new Error(
        `Edge ${edge.id || "(unknown)"} references missing source node: ${edge.source}`
      );
    }

    if (!nodeMap.has(edge.target)) {
      throw new Error(
        `Edge ${edge.id || "(unknown)"} references missing target node: ${edge.target}`
      );
    }

    outgoingEdges.get(edge.source).push(edge);
    incomingEdges.get(edge.target).push(edge);
  }

  // Identify source and terminal nodes
  const sourceNodes = graph.nodes.filter(
    (node) => incomingEdges.get(node.id).length === 0
  );

  const terminalNodes = graph.nodes.filter(
    (node) => outgoingEdges.get(node.id).length === 0
  );

  return {
    name: graph.name,
    config: graph.config || {},
    nodes: graph.nodes,
    edges: graph.edges,
    nodeMap,
    incomingEdges,
    outgoingEdges,
    sourceNodes,
    terminalNodes
  };
};

module.exports = parseGraph;
