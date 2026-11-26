const createSensorStream = require("./nodes/sensor.node");
const createMovingAverage = require("./nodes/movingAverage.node");
const createMathOperation = require("./nodes/mathOperation.node");
const createThreshold = require("./nodes/threshold.node");
const createActionTrigger = require("./nodes/actionTrigger.node");
const createSmsAlert = require("./nodes/smsAlert.node");

const nodeRegistry = {
  sensor: createSensorStream,

  movingAverage: createMovingAverage,

  mathOperation: createMathOperation,

  threshold: createThreshold,

  actionTrigger: createActionTrigger,

  smsAlert: createSmsAlert
};

module.exports = nodeRegistry;
