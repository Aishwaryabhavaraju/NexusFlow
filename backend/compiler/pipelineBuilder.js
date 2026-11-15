const { NODE_TYPES } = require("./compiler.constants");
const { buildNode } = require("./nodeRegistry");

const buildPipeline = (parsedGraph, sortedNodes, context) => {
  const streams = new Map();

  for (const node of sortedNodes) {
    // Sensor nodes create the initial Observable
    if (node.type === NODE_TYPES.SENSOR) {
      const source$ = buildNode(node, context);
      streams.set(node.id, source$);
      continue;
    }

    // Find the node connected to this node
    const incomingEdges = parsedGraph.incomingEdges.get(node.id);

    if (incomingEdges.length !== 1) {
      throw new Error(
        `Node ${node.id} must have exactly one input`
      );
    }

    const parentId = incomingEdges[0].source;
    const parentStream$ = streams.get(parentId);

    if (!parentStream$) {
      throw new Error(
        `Input stream not found for node ${node.id}`
      );
    }

    // Convert the current node into an RxJS operator
    const operator = buildNode(node, context);

    // Apply the operator to the parent's Observable
    const currentStream$ = parentStream$.pipe(operator);

    streams.set(node.id, currentStream$);
  }

  // Return the stream produced by the final node
  const finalNode = sortedNodes[sortedNodes.length - 1];

  return streams.get(finalNode.id);
};

module.exports = buildPipeline;
