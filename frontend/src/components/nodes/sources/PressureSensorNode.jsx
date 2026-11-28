import React, { memo } from 'react';
import { Activity } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function PressureSensorNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Pressure Sensor'}
      subtitle="Data Source"
      description="Hydraulic and pneumatic line pressure transmitter."
      category="sources"
      icon={Activity}
      hasInput={false}
      hasOutput={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Pressure:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
            {data.currentValue !== undefined ? data.currentValue : 142.0} {data.unit || 'bar'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
          <span>Sampling:</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{data.samplingRate || 250}ms</span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(PressureSensorNode);
