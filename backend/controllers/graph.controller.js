const { randomUUID } = require("crypto");

// Temporary storage for development
const graphs = new Map();

// POST /api/graphs
exports.createGraph = (req, res) => {
  try {
    const { name, nodes, edges } = req.body;

    if (!name || !Array.isArray(nodes) || !Array.isArray(edges)) {
      return res.status(400).json({
        success: false,
        message: "Name, nodes and edges are required"
      });
    }

    const nodeIds = new Set(nodes.map(node => node.id));

    const invalidEdge = edges.find(
      edge => !nodeIds.has(edge.source) || !nodeIds.has(edge.target)
    );

    if (invalidEdge) {
      return res.status(400).json({
        success: false,
        message: "Edge references an unknown node"
      });
    }

    const graphId = randomUUID();

    const graph = {
      graphId,
      name,
      nodes,
      edges,
      createdAt: new Date()
    };

    graphs.set(graphId, graph);

    return res.status(201).json({
      success: true,
      message: "Graph created successfully",
      data: graph
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/graphs/:graphId
exports.getGraph = (req, res) => {
  const graph = graphs.get(req.params.graphId);

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
};

