const Graph = require("../models/graph.model");

// CREATE GRAPH
// POST /api/graphs

exports.createGraph = async (req, res, next) => {
    try {
        const { name, description, nodes, edges } = req.body;

        // Validate required fields
        if (!name || !Array.isArray(nodes) || !Array.isArray(edges)) {
            return res.status(400).json({
                success: false,
                message: "Name, nodes and edges are required"
            });
        }

        // Check node IDs
        const nodeIds = new Set();

        for (const node of nodes) {
            if (!node.id || !node.type || nodeIds.has(node.id)) {
                return res.status(400).json({
                    success: false,
                    message: "Every node must have a unique ID and type"
                });
            }

            nodeIds.add(node.id);
        }

        // Check edge connections
        for (const edge of edges) {
            if (
                !edge.source ||
                !edge.target ||
                !nodeIds.has(edge.source) ||
                !nodeIds.has(edge.target)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid edge connection"
                });
            }
        }

        // Save graph to MongoDB
        const graph = await Graph.create({
            name,
            description,
            nodes,
            edges
        });

        res.status(201).json({
            success: true,
            message: "Graph saved successfully",
            data: graph
        });

    } catch (error) {
        next(error);
    }
};


// GET ALL GRAPHS
// GET /api/graphs

exports.getAllGraphs = async (req, res, next) => {
    try {
        const graphs = await Graph.find()
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: graphs.length,
            data: graphs
        });

    } catch (error) {
        next(error);
    }
};


// GET GRAPH BY ID
// GET /api/graphs/:graphId

exports.getGraphById = async (req, res, next) => {
    try {
        const graph = await Graph.findById(req.params.graphId);

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


// UPDATE GRAPH
// PUT /api/graphs/:graphId

exports.updateGraph = async (req, res, next) => {
    try {
        const { name, description, nodes, edges, status } = req.body;

        const graph = await Graph.findByIdAndUpdate(
            req.params.graphId,
            {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description }),
                ...(nodes !== undefined && { nodes }),
                ...(edges !== undefined && { edges }),
                ...(status !== undefined && { status })
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!graph) {
            return res.status(404).json({
                success: false,
                message: "Graph not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Graph updated successfully",
            data: graph
        });

    } catch (error) {
        next(error);
    }
};


// DELETE GRAPH
// DELETE /api/graphs/:graphId

exports.deleteGraph = async (req, res, next) => {
    try {
        const graph = await Graph.findByIdAndDelete(req.params.graphId);

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
