import {
  Gauge,
  Thermometer,
  Activity,
  Waves,
  TrendingUp,
  Sliders,
  Calculator,
  Filter,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  GitMerge,
  MessageSquare,
  Mail,
  Webhook,
  FileText
} from 'lucide-react';

export const NODE_CATEGORIES = {
  sources: {
    id: 'sources',
    name: 'Data Sources',
    color: 'var(--cat-source)',
    glow: 'var(--cat-source-glow)',
    badgeVariant: 'cyan',
    description: 'Physical & virtual industrial sensor streams'
  },
  processing: {
    id: 'processing',
    name: 'Processing',
    color: 'var(--cat-process)',
    glow: 'var(--cat-process-glow)',
    badgeVariant: 'green',
    description: 'Mathematical & windowed stream transformers'
  },
  conditions: {
    id: 'conditions',
    name: 'Conditions',
    color: 'var(--cat-condition)',
    glow: 'var(--cat-condition-glow)',
    badgeVariant: 'amber',
    description: 'Dynamic threshold triggers & boolean logic'
  },
  actions: {
    id: 'actions',
    name: 'Actions',
    color: 'var(--cat-action)',
    glow: 'var(--cat-action-glow)',
    badgeVariant: 'rose',
    description: 'Alert triggers, webhooks & plant logs'
  }
};

export const NODE_DEFINITIONS = [
  // 1. Data Sources
  {
    type: 'turbineSensor',
    category: 'sources',
    name: 'Turbine Sensor',
    icon: Gauge,
    description: 'Monitors turbine rotor RPM, oil temp, and vibration.',
    defaultData: {
      label: 'Turbine Main Shaft',
      unit: 'RPM',
      samplingRate: 100, // ms
      minValue: 0,
      maxValue: 3600,
      currentValue: 1820
    }
  },
  {
    type: 'temperatureSensor',
    category: 'sources',
    name: 'Temperature Sensor',
    icon: Thermometer,
    description: 'Thermocouple thermal probe for bearing or coolant.',
    defaultData: {
      label: 'Coolant Temp Probe',
      unit: '°C',
      samplingRate: 500,
      minValue: -20,
      maxValue: 150,
      currentValue: 74.5
    }
  },
  {
    type: 'pressureSensor',
    category: 'sources',
    name: 'Pressure Sensor',
    icon: Activity,
    description: 'Hydraulic and pneumatic line pressure transmitter.',
    defaultData: {
      label: 'Hydraulic Line A',
      unit: 'bar',
      samplingRate: 250,
      minValue: 0,
      maxValue: 250,
      currentValue: 142.0
    }
  },
  {
    type: 'vibrationSensor',
    category: 'sources',
    name: 'Vibration Sensor',
    icon: Waves,
    description: 'Tri-axial accelerometer for predictive maintenance.',
    defaultData: {
      label: 'Bearing X-Axis',
      unit: 'mm/s',
      samplingRate: 50,
      minValue: 0,
      maxValue: 50,
      currentValue: 4.8
    }
  },

  // 2. Processing
  {
    type: 'movingAverage',
    category: 'processing',
    name: 'Moving Average',
    icon: TrendingUp,
    description: 'Smoothes noise over a sliding window buffer.',
    defaultData: {
      label: 'SMA Window Filter',
      windowSize: 10,
      bufferType: 'rolling'
    }
  },
  {
    type: 'minMax',
    category: 'processing',
    name: 'Minimum/Maximum',
    icon: Sliders,
    description: 'Extracts telemetry extremes and peak variations.',
    defaultData: {
      label: 'Envelope Extractor',
      mode: 'peak-to-peak',
      windowDuration: '60s'
    }
  },
  {
    type: 'mathOperation',
    category: 'processing',
    name: 'Math Operation',
    icon: Calculator,
    description: 'Applies scale, gain, offset or unit conversion.',
    defaultData: {
      label: 'Gain & Offset',
      operation: 'multiply',
      factor: 1.25,
      offset: 0
    }
  },
  {
    type: 'filter',
    category: 'processing',
    name: 'Filter',
    icon: Filter,
    description: 'Suppresses micro-jitter outside deadband threshold.',
    defaultData: {
      label: 'Jitter Suppression',
      thresholdDelta: 0.5,
      filterType: 'deadband'
    }
  },

  // 3. Conditions
  {
    type: 'threshold',
    category: 'conditions',
    name: 'Threshold',
    icon: ShieldAlert,
    description: 'Triggers when value breaches safety bounds.',
    defaultData: {
      label: 'Overheat Tripwire',
      comparator: '>',
      limit: 95.0,
      hysteresis: 2.0
    }
  },
  {
    type: 'greaterThan',
    category: 'conditions',
    name: 'Greater Than',
    icon: ArrowUpRight,
    description: 'Passes true when stream exceeds target setpoint.',
    defaultData: {
      label: 'High Limit Check',
      value: 120.0
    }
  },
  {
    type: 'lessThan',
    category: 'conditions',
    name: 'Less Than',
    icon: ArrowDownRight,
    description: 'Passes true when stream drops below safety floor.',
    defaultData: {
      label: 'Low Pressure Trip',
      value: 30.0
    }
  },
  {
    type: 'andOr',
    category: 'conditions',
    name: 'AND/OR',
    icon: GitMerge,
    description: 'Combines multiple branch condition states.',
    defaultData: {
      label: 'Safety Matrix',
      logicGate: 'AND',
      inputCount: 2
    }
  },

  // 4. Actions
  {
    type: 'smsAlert',
    category: 'actions',
    name: 'SMS Alert',
    icon: MessageSquare,
    description: 'Dispatches emergency SMS to floor engineer.',
    defaultData: {
      label: 'Plant Lead SMS',
      recipient: '+1-555-0199',
      priority: 'CRITICAL',
      cooldownMinutes: 15
    }
  },
  {
    type: 'emailAlert',
    category: 'actions',
    name: 'Email Alert',
    icon: Mail,
    description: 'Sends diagnostic event report to monitoring group.',
    defaultData: {
      label: 'Ops Email Alert',
      recipient: 'plant-ops@nexusflow.io',
      subject: '[ALERT] IIoT Pipeline Breach'
    }
  },
  {
    type: 'webhook',
    category: 'actions',
    name: 'Webhook',
    icon: Webhook,
    description: 'Fires REST POST payload to plant SCADA/MES.',
    defaultData: {
      label: 'SCADA Webhook',
      endpointUrl: 'https://scada.plant.internal/api/v1/trips',
      method: 'POST'
    }
  },
  {
    type: 'logEvent',
    category: 'actions',
    name: 'Log Event',
    icon: FileText,
    description: 'Records telemetry snapshot to persistent audit stream.',
    defaultData: {
      label: 'Audit Log Recorder',
      logLevel: 'WARN',
      retentionDays: 30
    }
  }
];

export function getNodeDefinition(type) {
  return NODE_DEFINITIONS.find((n) => n.type === type);
}
