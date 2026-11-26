const nodeRegistry = require("./nodeRegistry");

const buildPipeline = (
  parsedGraph,
  sortedNodes,
  context = {}
) => {
  if (!Array.isArray(sortedNodes) || sortedNodes.length === 0) {
    throw new Error("No nodes available to build pipeline");
  }

  let pipeline$ = null;

  for (const node of sortedNodes) {
    const nodeHandler = nodeRegistry[node.type];

    if (!nodeHandler) {
      throw new Error(`No handler registered for node type: ${node.type}`);
    }

    // Sensor node creates the source Observable
    if (node.type === "sensor") {
      if (pipeline$ !== null) {
        throw new Error("Multiple sensor nodes are not supported");
      }

      pipeline$ = nodeHandler(node, context);

      continue;
    }

    // All other nodes must have a source stream
    if (!pipeline$) {
      throw new Error(
        `Sensor source must appear before node: ${node.id}`
      );
    }

    // Create the RxJS operator
    const operator = nodeHandler(node, context);

    if (typeof operator !== "function") {
      throw new Error(
        `Node ${node.id} did not return a valid RxJS operator`
      );
    }

    // Connect the next node to the existing stream
    pipeline$ = pipeline$.pipe(operator);
  }

  if (!pipeline$) {
    throw new Error("Unable to create pipeline: Sensor source missing");
  }

  return pipeline$;
};

module.exports = buildPipeline;
