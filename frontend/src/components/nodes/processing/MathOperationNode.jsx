import React, { memo } from 'react';
import { Calculator } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function MathOperationNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Math Operation'}
      subtitle="Processing"
      description="Applies scale, gain, offset or unit conversion."
      category="processing"
      icon={Calculator}
      hasInput={true}
      hasOutput={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Operation:</span>
          <span style={{ textTransform: 'capitalize', color: 'var(--text-primary)' }}>
            {data.operation || 'multiply'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Gain Factor:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--accent-green)' }}>
            ×{data.factor !== undefined ? data.factor : 1.25}
          </span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(MathOperationNode);
