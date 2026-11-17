const sortGraphNodes = (parsedGraph) => {
  const {
    nodes,
    incomingEdges,
    outgoingEdges,
    nodeMap
  } = parsedGraph;

  const inDegree = new Map();

  nodes.forEach((node) => {
    inDegree.set(
      node.id,
      incomingEdges.get(node.id).length
    );
  });

  const queue = nodes
    .filter((node) => inDegree.get(node.id) === 0)
    .map((node) => node.id);

  const sortedNodes = [];

  while (queue.length > 0) {
    const currentId = queue.shift();

    sortedNodes.push(nodeMap.get(currentId));

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

  if (sortedNodes.length !== nodes.length) {
    throw new Error("Cannot sort graph: cycle detected");
  }

  return sortedNodes;
};

module.exports = sortGraphNodes;
