const express = require("express");
const router = express.Router();

const {
  startRule,
  stopRule,
  getRuleStatus
} = require("../controllers/rule.controller");

router.post("/:graphId/start", startRule);
router.post("/:graphId/stop", stopRule);
router.get("/:graphId/status", getRuleStatus);

module.exports = router;
