import React, { memo } from 'react';
import { ArrowDownRight } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function LessThanNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Less Than'}
      subtitle="Condition"
      description="Passes true when stream drops below safety floor."
      category="conditions"
      icon={ArrowDownRight}
      hasInput={true}
      hasOutput={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Comparison:</span>
          <span style={{ color: 'var(--text-primary)' }}>Value &lt; Setpoint</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Limit Value:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-amber)' }}>
            &lt; {data.value !== undefined ? data.value : 30.0}
          </span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(LessThanNode);
