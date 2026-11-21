import React, { memo } from 'react';
import { GitMerge } from 'lucide-react';
import { Position } from '@xyflow/react';
import BaseNode from '../BaseNode.jsx';

function AndOrNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'AND/OR'}
      subtitle="Condition Logic"
      description="Combines multiple branch condition states."
      category="conditions"
      icon={GitMerge}
      hasInput={true}
      hasOutput={true}
      inputHandles={[
        { id: 'input-a', position: Position.Left, style: { top: '42%' } },
        { id: 'input-b', position: Position.Left, style: { top: '78%' } }
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Logic Gate:</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: '700',
              padding: '2px 8px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              borderRadius: '4px',
              color: 'var(--accent-amber)'
            }}
          >
            {data.logicGate || 'AND'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
          <span>Input Pins:</span>
          <span>A (top) &amp; B (bottom)</span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(AndOrNode);
