/**
 * Sort graph nodes in execution order using Kahn's Algorithm.
 * @param {Object} parsedGraph - Output from graphParser
 * @returns {Array} Nodes arranged in execution order
 */
const sortGraphNodes = (parsedGraph) => {
  const {
    nodes,
    nodeMap,
    incomingEdges,
    outgoingEdges
  } = parsedGraph;

  // Calculate the number of incoming edges for each node.
  const inDegree = new Map();

  for (const node of nodes) {
    inDegree.set(
      node.id,
      incomingEdges.get(node.id).length
    );
  }

  // Start with nodes that have no incoming edges.
  const queue = [];

  for (const node of nodes) {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id);
    }
  }

  const sortedNodes = [];

  // Process nodes in topological order.
  while (queue.length > 0) {
    const currentNodeId = queue.shift();
    const currentNode = nodeMap.get(currentNodeId);

    sortedNodes.push(currentNode);

    // Visit all nodes connected to the current node.
    const connectedEdges =
      outgoingEdges.get(currentNodeId);

    for (const edge of connectedEdges) {
      const targetId = edge.target;

      // Reduce the target node's incoming edge count.
      const updatedDegree =
        inDegree.get(targetId) - 1;

      inDegree.set(targetId, updatedDegree);

      // Process the target when all its inputs are ready.
      if (updatedDegree === 0) {
        queue.push(targetId);
      }
    }
  }

  // If some nodes remain, the graph contains a cycle.
  if (sortedNodes.length !== nodes.length) {
    throw new Error(
      "Graph contains a cycle. Execution order cannot be determined."
    );
  }

  return sortedNodes;
};

module.exports = sortGraphNodes;
