import React, { memo } from 'react';
import { Filter } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function FilterNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Filter'}
      subtitle="Processing"
      description="Suppresses micro-jitter outside deadband threshold."
      category="processing"
      icon={Filter}
      hasInput={true}
      hasOutput={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Deadband Delta:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--accent-green)' }}>
            ±{data.thresholdDelta || 0.5}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
          <span>Filter Algorithm:</span>
          <span>{data.filterType || 'deadband'}</span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(FilterNode);
