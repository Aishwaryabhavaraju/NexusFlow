import React, { memo } from 'react';
import { Sliders } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function MinMaxNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Minimum/Maximum'}
      subtitle="Processing"
      description="Extracts telemetry extremes and peak variations."
      category="processing"
      icon={Sliders}
      hasInput={true}
      hasOutput={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Extraction Mode:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--accent-green)' }}>
            {data.mode || 'peak-to-peak'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
          <span>Window Duration:</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{data.windowDuration || '60s'}</span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(MinMaxNode);
