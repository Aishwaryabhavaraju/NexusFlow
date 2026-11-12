const express = require("express");

const router = express.Router();

const {
    createGraph,
    getAllGraphs,
    getGraphById,
    updateGraph,
    deleteGraph
} = require("../controllers/graph.controller");

// Create a new graph
router.post("/", createGraph);

// Retrieve all graphs
router.get("/", getAllGraphs);

// Retrieve a specific graph
router.get("/:graphId", getGraphById);

// Update an existing graph
router.put("/:graphId", updateGraph);

// Delete a graph
router.delete("/:graphId", deleteGraph);

module.exports = router;
