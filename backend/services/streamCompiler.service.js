const parseGraph = require("../compiler/graphParser");
const validateGraph = require("../compiler/graphValidator");
const sortGraphNodes = require("../compiler/graphSorter");
const buildPipeline = require("../compiler/pipelineBuilder");

const {
  telemetryStream$
} = require("./telemetryStream.service");

class StreamCompiler {
  // Step 1: Parse, validate, sort and compile the graph
  compile(graph, options = {}) {
    // Parse the incoming React Flow JSON
    const parsedGraph = parseGraph(graph);

    // Validate the parsed graph
    const validation = validateGraph(parsedGraph);

    if (!validation.isValid) {
      const error = new Error("Graph validation failed");
      error.validationErrors = validation.errors;
      throw error;
    }

    // Determine the correct node execution order
    const sortedNodes = sortGraphNodes(parsedGraph);

    console.log(
      "Workflow execution order:",
      sortedNodes.map(node => node.id)
    );

    // Build the RxJS pipeline
    const pipeline$ = buildPipeline(
      parsedGraph,
      sortedNodes,
      {
        telemetryStream$: options.telemetryStream$ || telemetryStream$,
        sendAlert: options.sendAlert
      }
    );

    return pipeline$;
  }

  // Step 2: Execute the compiled pipeline
  execute(graph, options = {}) {
    const pipeline$ = this.compile(graph, options);

    const subscription = pipeline$.subscribe({
      next: data => {
        console.log("Pipeline Output:", data);

        if (typeof options.onData === "function") {
          options.onData(data);
        }
      },

      error: error => {
        console.error("Pipeline Error:", error.message);

        if (typeof options.onError === "function") {
          options.onError(error);
        }
      },

      complete: () => {
        console.log("Pipeline Completed");

        if (typeof options.onComplete === "function") {
          options.onComplete();
        }
      }
    });

    return subscription;
  }
}

module.exports = new StreamCompiler();
