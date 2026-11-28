import React, { memo } from 'react';
import { Thermometer } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function TemperatureSensorNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Temperature Sensor'}
      subtitle="Data Source"
      description="Thermocouple thermal probe for bearing or coolant."
      category="sources"
      icon={Thermometer}
      hasInput={false}
      hasOutput={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Temperature:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
            {data.currentValue !== undefined ? data.currentValue : 74.5} {data.unit || '°C'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
          <span>Sampling:</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{data.samplingRate || 500}ms</span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(TemperatureSensorNode);
