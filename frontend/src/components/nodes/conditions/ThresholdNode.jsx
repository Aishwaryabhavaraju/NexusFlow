import React, { memo } from 'react';
import { ShieldAlert } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function ThresholdNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Threshold'}
      subtitle="Condition"
      description="Triggers when value breaches safety bounds."
      category="conditions"
      icon={ShieldAlert}
      hasInput={true}
      hasOutput={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>Trip Boundary:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-amber)' }}>
            {data.comparator || '>'} {data.limit !== undefined ? data.limit : 95.0}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
          <span>Hysteresis:</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>±{data.hysteresis || 2.0}</span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(ThresholdNode);
