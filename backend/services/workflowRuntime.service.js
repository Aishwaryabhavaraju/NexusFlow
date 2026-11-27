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

  if (graph.config?.isEnabled === false) {
    throw new Error("Workflow is disabled");
  }

  const graphData = graph.toObject();

  let subscription;

  subscription = StreamCompiler.execute(graphData, {
    sendAlert: alert => {
      console.log("Workflow Alert:", alert);
    },

    onData: data => {
      console.log("Workflow processed telemetry:", data);
    },

    onError: error => {
      console.error("Workflow execution failed:", error.message);

      if (activeWorkflows.get(graphId) === subscription) {
        activeWorkflows.delete(graphId);
      }
    },

    onComplete: () => {
      if (activeWorkflows.get(graphId) === subscription) {
        activeWorkflows.delete(graphId);
      }
    }
  });

  if (subscription.closed) {
    throw new Error("Workflow subscription could not be started");
  }

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

const getActiveWorkflowCount = () => {
  return activeWorkflows.size;
};

module.exports = {
  startWorkflow,
  stopWorkflow,
  getWorkflowStatus,
  getActiveWorkflowCount
};
