const parseGraph = require("../compiler/graphParser");
const validateGraph = require("../compiler/graphValidator");
const sortGraphNodes = require("../compiler/graphSorter");
const buildPipeline = require("../compiler/pipelineBuilder");

const {
  telemetryStream$
} = require("./telemetryStream.service");

class StreamCompiler {
  // Convert graph JSON into an executable Observable
  compile(graph, options = {}) {
    try {
      console.log("Starting NexusFlow Stream Compiler...");

      // Step 1: Parse graph
      const parsedGraph = parseGraph(graph);

      // Step 2: Validate graph
      validateGraph(parsedGraph);

      // Step 3: Determine execution order
      const sortedNodes = sortGraphNodes(parsedGraph);

      console.log(
        "Execution order:",
        sortedNodes.map((node) => node.type)
      );

      // Step 4: Build RxJS pipeline
      const observable = buildPipeline(
        parsedGraph,
        sortedNodes,
        {
          telemetryStream$: options.telemetryStream$ || telemetryStream$,
          sendAlert: options.sendAlert
        }
      );

      console.log("Stream Compiler completed successfully");

      return observable;
    } catch (error) {
      console.error("Stream compilation failed:", error.message);
      throw error;
    }
  }

  // Compile and start executing a graph
  execute(graph, options = {}) {
    const observable = this.compile(graph, options);

    const subscription = observable.subscribe({
      next: (data) => {
        console.log("Pipeline output:", data);

        if (options.onData) {
          options.onData(data);
        }
      },

      error: (error) => {
        console.error("Pipeline execution error:", error.message);

        if (options.onError) {
          options.onError(error);
        }
      },

      complete: () => {
        console.log("Pipeline execution completed");

        if (options.onComplete) {
          options.onComplete();
        }
      }
    });

    return subscription;
  }
}

module.exports = new StreamCompiler();
