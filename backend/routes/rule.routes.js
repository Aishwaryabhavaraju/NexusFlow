const express = require("express");
const router = express.Router();
const ruleController = require("../controllers/rule.controller");

router.post("/:graphId/execute", ruleController.executeRule);
router.get("/:ruleId/status", ruleController.getRuleStatus);

module.exports = router;

