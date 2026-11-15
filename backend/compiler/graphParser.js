const parseGraph = (graph) => {
  if (!graph || !Array.isArray(graph.nodes) ||
      !Array.isArray(graph.edges)) {
    throw new Error("Invalid graph format");
  }

  const nodeMap = new Map();

  graph.nodes.forEach((node) => {
    nodeMap.set(node.id, node);
  });

  const incomingEdges = new Map();
  const outgoingEdges = new Map();

  graph.nodes.forEach((node) => {
    incomingEdges.set(node.id, []);
    outgoingEdges.set(node.id, []);
  });

  graph.edges.forEach((edge) => {
    if (!nodeMap.has(edge.source) || !nodeMap.has(edge.target)) {
      throw new Error(`Invalid edge: ${edge.id}`);
    }

    incomingEdges.get(edge.target).push(edge);
    outgoingEdges.get(edge.source).push(edge);
  });

  return {
    nodes: graph.nodes,
    edges: graph.edges,
    nodeMap,
    incomingEdges,
    outgoingEdges,
    config: graph.config || {}
  };
};

module.exports = parseGraph;
