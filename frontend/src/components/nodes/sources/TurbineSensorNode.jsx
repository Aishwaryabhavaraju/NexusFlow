import React, { memo } from 'react';
import { Gauge } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function TurbineSensorNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Turbine Sensor'}
      subtitle="Data Source"
      description="Monitors turbine rotor RPM, oil temp, and vibration."
      category="sources"
      icon={Gauge}
      hasInput={false}
      hasOutput={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Speed:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
            {data.currentValue !== undefined ? data.currentValue : 1820} {data.unit || 'RPM'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
          <span>Sampling:</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{data.samplingRate || 100}ms</span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(TurbineSensorNode);
