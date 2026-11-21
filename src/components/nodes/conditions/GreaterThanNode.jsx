import React, { memo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function GreaterThanNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Greater Than'}
      subtitle="Condition"
      description="Passes true when stream exceeds target setpoint."
      category="conditions"
      icon={ArrowUpRight}
      hasInput={true}
      hasOutput={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Comparison:</span>
          <span style={{ color: 'var(--text-primary)' }}>Value &gt; Setpoint</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Limit Value:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-amber)' }}>
            &gt; {data.value !== undefined ? data.value : 120.0}
          </span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(GreaterThanNode);
