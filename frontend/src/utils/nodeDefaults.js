export const initialDemoNodes = [
  {
    id: 'turbineSensor-1',
    type: 'turbineSensor',
    position: { x: 60, y: 160 },
    data: {
      label: 'Turbine Sensor',
      unit: 'RPM',
      samplingRate: 100,
      currentValue: 2450
    }
  },
  {
    id: 'movingAverage-1',
    type: 'movingAverage',
    position: { x: 340, y: 160 },
    data: {
      label: 'Moving Average',
      windowSize: 10,
      inputField: 'sensor_telemetry',
      outputName: 'smoothed_avg_stream'
    }
  },
  {
    id: 'threshold-1',
    type: 'threshold',
    position: { x: 620, y: 160 },
    data: {
      label: 'Threshold',
      comparator: '>',
      limit: 2200,
      unit: 'RPM',
      hysteresis: 2.0
    }
  },
  {
    id: 'smsAlert-1',
    type: 'smsAlert',
    position: { x: 900, y: 160 },
    data: {
      label: 'SMS Alert',
      phoneNumber: '+1-555-0144',
      recipient: '+1-555-0144',
      message: '[CRITICAL ALERT] Turbine rotor speed has breached 2200 RPM safety limit.'
    }
  }
];

const DEMO_EDGE_STYLE = { stroke: '#38bdf8', strokeWidth: 2 };
const DEMO_MARKER = { type: 'arrowclosed', color: '#38bdf8', width: 16, height: 16 };

export const initialDemoEdges = [
  {
    id: 'e-turbine-to-ma',
    source: 'turbineSensor-1',
    target: 'movingAverage-1',
    type: 'smoothstep',
    animated: true,
    style: DEMO_EDGE_STYLE,
    markerEnd: DEMO_MARKER
  },
  {
    id: 'e-ma-to-threshold',
    source: 'movingAverage-1',
    target: 'threshold-1',
    type: 'smoothstep',
    animated: true,
    style: DEMO_EDGE_STYLE,
    markerEnd: DEMO_MARKER
  },
  {
    id: 'e-threshold-to-sms',
    source: 'threshold-1',
    target: 'smsAlert-1',
    type: 'smoothstep',
    animated: true,
    style: DEMO_EDGE_STYLE,
    markerEnd: DEMO_MARKER
  }
];
