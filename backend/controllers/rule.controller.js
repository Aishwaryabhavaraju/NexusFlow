const mongoose = require("mongoose");

const {
  startWorkflow,
  stopWorkflow,
  getWorkflowStatus
} = require("../services/workflowRuntime.service");

const startRule = async (req, res) => {
  try {
    const { graphId } = req.params;

    if (!mongoose.isValidObjectId(graphId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid graph ID"
      });
    }

    const result = await startWorkflow(graphId);

    return res.status(200).json({
      success: true,
      message: "Workflow started successfully",
      data: result
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const stopRule = (req, res) => {
  try {
    const { graphId } = req.params;

    if (!mongoose.isValidObjectId(graphId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid graph ID"
      });
    }

    const result = stopWorkflow(graphId);

    return res.status(200).json({
      success: true,
      message: "Workflow stopped successfully",
      data: result
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getRuleStatus = (req, res) => {
  const { graphId } = req.params;

  if (!mongoose.isValidObjectId(graphId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid graph ID"
    });
  }

  return res.status(200).json({
    success: true,
    graphId,
    status: getWorkflowStatus(graphId)
  });
};

module.exports = {
  startRule,
  stopRule,
  getRuleStatus
};
