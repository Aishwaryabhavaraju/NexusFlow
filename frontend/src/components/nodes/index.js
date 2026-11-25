import SensorNode from "./SensorNode";
import MovingAverageNode from "./MovingAverageNode";
import MathOperationNode from "./MathOperationNode";
import ThresholdNode from "./ThresholdNode";
import SmsAlertNode from "./SmsAlertNode";
import ActionTriggerNode from "./ActionTriggerNode";

export const nodeTypes = {
  sensor: SensorNode,
  movingAverage: MovingAverageNode,
  mathOperation: MathOperationNode,
  threshold: ThresholdNode,
  smsAlert: SmsAlertNode,
  actionTrigger: ActionTriggerNode
};

export {
  SensorNode,
  MovingAverageNode,
  MathOperationNode,
  ThresholdNode,
  SmsAlertNode,
  ActionTriggerNode
};
