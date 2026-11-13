const mongoose = require("mongoose");
const Graph = require("../models/graph.model");
const validateGraph = require("../utils/validateGraph");

const {
  DEFAULT_GRAPH_CONFIG
} = require("../constants/graph.constants");

// Create a new graph
const createGraph = async (req, res, next) => {
  try {
    const graphData = {
      ...req.body,
      config: {
        ...DEFAULT_GRAPH_CONFIG,
        ...(req.body.config || {})
      }
    };

    const validationError = validateGraph(graphData);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const graph = await Graph.create(graphData);

    res.status(201).json({
      success: true,
      message: "Graph created successfully",
      data: graph
    });
  } catch (error) {
    next(error);
  }
};

// Get all graphs
const getAllGraphs = async (req, res, next) => {
  try {
    const graphs = await Graph.find().sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: graphs.length,
      data: graphs
    });
  } catch (error) {
    next(error);
  }
};

// Get a graph by ID
const getGraphById = async (req, res, next) => {
  try {
    const { graphId } = req.params;

    if (!mongoose.isValidObjectId(graphId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid graph ID"
      });
    }

    const graph = await Graph.findById(graphId);

    if (!graph) {
      return res.status(404).json({
        success: false,
        message: "Graph not found"
      });
    }

    res.status(200).json({
      success: true,
      data: graph
    });
  } catch (error) {
    next(error);
  }
};

// Update a graph
const updateGraph = async (req, res, next) => {
  try {
    const { graphId } = req.params;

    if (!mongoose.isValidObjectId(graphId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid graph ID"
      });
    }

    const graph = await Graph.findById(graphId);

    if (!graph) {
      return res.status(404).json({
        success: false,
        message: "Graph not found"
      });
    }

    const updatedData = {
      name: req.body.name ?? graph.name,
      description: req.body.description ?? graph.description,
      config: {
        ...graph.config.toObject(),
        ...(req.body.config || {})
      },
      nodes: req.body.nodes ?? graph.nodes,
      edges: req.body.edges ?? graph.edges
    };

    const validationError = validateGraph(updatedData);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    graph.name = updatedData.name;
    graph.description = updatedData.description;
    graph.config = updatedData.config;
    graph.nodes = updatedData.nodes;
    graph.edges = updatedData.edges;

    if (req.body.status !== undefined) {
      graph.status = req.body.status;
    }

    await graph.save();

    res.status(200).json({
      success: true,
      message: "Graph updated successfully",
      data: graph
    });
  } catch (error) {
    next(error);
  }
};

// Delete a graph
const deleteGraph = async (req, res, next) => {
  try {
    const { graphId } = req.params;

    if (!mongoose.isValidObjectId(graphId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid graph ID"
      });
    }

    const graph = await Graph.findByIdAndDelete(graphId);

    if (!graph) {
      return res.status(404).json({
        success: false,
        message: "Graph not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Graph deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGraph,
  getAllGraphs,
  getGraphById,
  updateGraph,
  deleteGraph
};
