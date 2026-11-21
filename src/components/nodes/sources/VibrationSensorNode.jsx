import React, { memo } from 'react';
import { Waves } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function VibrationSensorNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Vibration Sensor'}
      subtitle="Data Source"
      description="Tri-axial accelerometer for predictive maintenance."
      category="sources"
      icon={Waves}
      hasInput={false}
      hasOutput={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Vibration RMS:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
            {data.currentValue !== undefined ? data.currentValue : 4.8} {data.unit || 'mm/s'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
          <span>Sampling:</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{data.samplingRate || 50}ms</span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(VibrationSensorNode);
