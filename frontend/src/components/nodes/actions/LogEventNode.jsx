import React, { memo } from 'react';
import { FileText } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function LogEventNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Log Event'}
      subtitle="Action Dispatcher"
      description="Records telemetry snapshot to persistent audit stream."
      category="actions"
      icon={FileText}
      hasInput={true}
      hasOutput={false}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Audit Severity:</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: '700',
              padding: '1px 6px',
              borderRadius: '3px',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              color: 'var(--accent-rose)'
            }}
          >
            {data.logLevel || 'WARN'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
          <span>Retention:</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{data.retentionDays || 30} days</span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(LogEventNode);
