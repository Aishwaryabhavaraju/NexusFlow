// 1. Data Sources
import TurbineSensorNode from './sources/TurbineSensorNode.jsx';
import TemperatureSensorNode from './sources/TemperatureSensorNode.jsx';
import PressureSensorNode from './sources/PressureSensorNode.jsx';
import VibrationSensorNode from './sources/VibrationSensorNode.jsx';

// 2. Processing
import MovingAverageNode from './processing/MovingAverageNode.jsx';
import MinMaxNode from './processing/MinMaxNode.jsx';
import MathOperationNode from './processing/MathOperationNode.jsx';
import FilterNode from './processing/FilterNode.jsx';

// 3. Conditions
import ThresholdNode from './conditions/ThresholdNode.jsx';
import GreaterThanNode from './conditions/GreaterThanNode.jsx';
import LessThanNode from './conditions/LessThanNode.jsx';
import AndOrNode from './conditions/AndOrNode.jsx';

// 4. Actions
import SmsAlertNode from './actions/SmsAlertNode.jsx';
import EmailAlertNode from './actions/EmailAlertNode.jsx';
import WebhookNode from './actions/WebhookNode.jsx';
import LogEventNode from './actions/LogEventNode.jsx';

export const nodeTypes = {
  // Data Sources (No input, Output on Right)
  turbineSensor: TurbineSensorNode,
  temperatureSensor: TemperatureSensorNode,
  pressureSensor: PressureSensorNode,
  vibrationSensor: VibrationSensorNode,

  // Processing (Input on Left, Output on Right)
  movingAverage: MovingAverageNode,
  minMax: MinMaxNode,
  mathOperation: MathOperationNode,
  filter: FilterNode,

  // Conditions (Input on Left, Output on Right / Dual Input for AND/OR)
  threshold: ThresholdNode,
  greaterThan: GreaterThanNode,
  lessThan: LessThanNode,
  andOr: AndOrNode,

  // Actions (Input on Left, No Output)
  smsAlert: SmsAlertNode,
  emailAlert: EmailAlertNode,
  webhook: WebhookNode,
  logEvent: LogEventNode
};
