const sortGraphNodes = (parsedGraph) => {
  const { nodes, outgoingEdges, incomingEdges } = parsedGraph;

  const inDegree = new Map();

  nodes.forEach((node) => {
    inDegree.set(
      node.id,
      incomingEdges.get(node.id).length
    );
  });

  // Start with nodes having no incoming edges
  const queue = nodes
    .filter((node) => inDegree.get(node.id) === 0)
    .map((node) => node.id);

  const sortedNodes = [];

  while (queue.length > 0) {
    const currentId = queue.shift();

    sortedNodes.push(
      parsedGraph.nodeMap.get(currentId)
    );

    const edges = outgoingEdges.get(currentId);

    edges.forEach((edge) => {
      const targetId = edge.target;

      inDegree.set(
        targetId,
        inDegree.get(targetId) - 1
      );

      if (inDegree.get(targetId) === 0) {
        queue.push(targetId);
      }
    });
  }

  // If not all nodes are sorted, the graph contains a cycle
  if (sortedNodes.length !== nodes.length) {
    throw new Error(
      "Invalid graph: circular connection detected"
    );
  }

  return sortedNodes;
};

module.exports = sortGraphNodes;
