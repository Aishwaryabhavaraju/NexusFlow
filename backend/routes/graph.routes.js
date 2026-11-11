const express = require("express");
const router = express.Router();
const graphController = require("../controllers/graph.controller");

router.post("/", graphController.createGraph);
router.get("/:graphId", graphController.getGraph);

module.exports = router;

