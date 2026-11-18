const parseGraph = require("../compiler/graphParser");
const validateGraph = require("../compiler/graphValidator");
const sortGraphNodes = require("../compiler/graphSorter");
const buildPipeline = require("../compiler/pipelineBuilder");

const { telemetryStream$ } =
  require("./telemetryStream.service");

class StreamCompiler {
  compile(graph, options = {}) {
    const parsedGraph = parseGraph(graph);

    const validation = validateGraph(parsedGraph);

    if (!validation.isValid) {
      const error = new Error("Graph validation failed");
      error.validationErrors = validation.errors;
      throw error;
    }

    // Determine the execution order.
    const sortedNodes = sortGraphNodes(parsedGraph);

    console.log(
      "Execution Order:",
      sortedNodes.map(node => node.id)
    );

    // Build the RxJS pipeline.
    return buildPipeline(parsedGraph, sortedNodes, {
      telemetryStream$:
        options.telemetryStream$ || telemetryStream$,
      sendAlert: options.sendAlert
    });
  }

  execute(graph, options = {}) {
    const observable = this.compile(graph, options);

    return observable.subscribe({
      next: data => {
        console.log("Pipeline Output:", data);
        options.onData?.(data);
      },
      error: error => {
        console.error("Pipeline Error:", error.message);
        options.onError?.(error);
      },
      complete: () => {
        console.log("Pipeline Completed");
        options.onComplete?.();
      }
    });
  }
}

module.exports = new StreamCompiler();
