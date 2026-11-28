import React, { memo } from 'react';
import { TrendingUp } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function MovingAverageNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Moving Average'}
      subtitle="Processing"
      description="Smoothes noise over a sliding window buffer."
      category="processing"
      icon={TrendingUp}
      hasInput={true}
      hasOutput={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Window Size:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--accent-green)' }}>
            {data.windowSize || 10} samples
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
          <span>Buffer:</span>
          <span>{data.bufferType || 'rolling'}</span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(MovingAverageNode);
