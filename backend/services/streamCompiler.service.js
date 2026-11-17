const parseGraph = require("../compiler/graphParser");
const validateGraph = require("../compiler/graphValidator");
const sortGraphNodes = require("../compiler/graphSorter");
const buildPipeline = require("../compiler/pipelineBuilder");

const {
  telemetryStream$
} = require("./telemetryStream.service");

class StreamCompiler {
  compile(graph, options = {}) {
    // Step 1: Parse the graph
    const parsedGraph = parseGraph(graph);

    // Step 2: Validate the parsed graph
    const validation = validateGraph(parsedGraph);

    if (!validation.isValid) {
      const error = new Error("Graph validation failed");
      error.validationErrors = validation.errors;
      throw error;
    }

    // Step 3: Sort the graph
    const sortedNodes = sortGraphNodes(parsedGraph);

    console.log(
      "Execution order:",
      sortedNodes.map((node) => node.id)
    );

    // Step 4: Build RxJS pipeline
    return buildPipeline(
      parsedGraph,
      sortedNodes,
      {
        telemetryStream$:
          options.telemetryStream$ || telemetryStream$,
        sendAlert: options.sendAlert
      }
    );
  }

  execute(graph, options = {}) {
    const observable = this.compile(graph, options);

    return observable.subscribe({
      next: (data) => {
        console.log("Pipeline output:", data);
        options.onData?.(data);
      },

      error: (error) => {
        console.error("Pipeline error:", error.message);
        options.onError?.(error);
      },

      complete: () => {
        console.log("Pipeline completed");
        options.onComplete?.();
      }
    });
  }
}

module.exports = new StreamCompiler();
