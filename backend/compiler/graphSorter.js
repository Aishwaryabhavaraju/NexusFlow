const sortGraphNodes = (parsedGraph) => {
  const {
    nodes,
    nodeMap,
    incomingEdges,
    outgoingEdges
  } = parsedGraph;

  const inDegree = new Map();

  for (const node of nodes) {
    inDegree.set(
      node.id,
      incomingEdges.get(node.id).length
    );
  }

  // Initialize queue with source nodes.
  const queue = [];

  for (const node of nodes) {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id);
    }
  }

  const sortedNodes = [];

  // Use an index instead of repeatedly shifting the queue.
  let front = 0;

  while (front < queue.length) {
    const currentId = queue[front++];

    sortedNodes.push(nodeMap.get(currentId));

    for (const edge of outgoingEdges.get(currentId)) {
      const targetId = edge.target;

      const updatedDegree = inDegree.get(targetId) - 1;

      inDegree.set(targetId, updatedDegree);

      if (updatedDegree === 0) {
        queue.push(targetId);
      }
    }
  }

  if (sortedNodes.length !== nodes.length) {
    throw new Error(
      "Graph contains a cycle. Execution order cannot be determined."
    );
  }

  return sortedNodes;
};

module.exports = sortGraphNodes;
