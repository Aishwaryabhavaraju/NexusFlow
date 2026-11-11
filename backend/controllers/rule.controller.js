exports.executeRule = (req, res) => {
  const { graphId } = req.params;

  // Actual RxJS execution will be implemented
  // as part of the Stream Compiler.
  res.status(501).json({
    success: false,
    message: "Rule execution engine is under development",
    graphId
  });
};

exports.getRuleStatus = (req, res) => {
  const { ruleId } = req.params;

  res.status(501).json({
    success: false,
    message: "Rule status service is under development",
    ruleId
  });
};

