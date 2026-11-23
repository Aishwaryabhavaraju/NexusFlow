const Graph = require("../models/graph.model");
const StreamCompiler = require("./streamCompiler.service");

const activeWorkflows = new Map();

const startWorkflow = async (graphId) => {
  if (activeWorkflows.has(graphId)) {
    throw new Error("Workflow is already running");
  }

  const graph = await Graph.findById(graphId);

  if (!graph) {
    throw new Error("Workflow not found");
  }

  if (!graph.config?.isEnabled) {
    throw new Error("Workflow is disabled");
  }

  // Convert the Mongoose document into a plain object.
  const graphData = graph.toObject();

  const subscription = StreamCompiler.execute(graphData, {
    sendAlert: (alert) => {
      console.log("Workflow Alert:", alert);

      // Later, this callback can be connected to
      // Member 4's dashboard and notification module.
    },

    onError: (error) => {
      console.error(
        `Workflow ${graphId} failed:`,
        error.message
      );

      activeWorkflows.delete(graphId);
    },

    onComplete: () => {
      activeWorkflows.delete(graphId);
    }
  });

  activeWorkflows.set(graphId, subscription);

  return {
    graphId,
    status: "running"
  };
};

const stopWorkflow = (graphId) => {
  const subscription = activeWorkflows.get(graphId);

  if (!subscription) {
    throw new Error("Workflow is not running");
  }

  subscription.unsubscribe();
  activeWorkflows.delete(graphId);

  return {
    graphId,
    status: "stopped"
  };
};

const getWorkflowStatus = (graphId) => {
  return activeWorkflows.has(graphId)
    ? "running"
    : "stopped";
};

module.exports = {
  startWorkflow,
  stopWorkflow,
  getWorkflowStatus
};
