import React, { memo } from 'react';
import { MessageSquare } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function SmsAlertNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'SMS Alert'}
      subtitle="Action Dispatcher"
      description="Dispatches emergency SMS to floor engineer."
      category="actions"
      icon={MessageSquare}
      hasInput={true}
      hasOutput={false}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Recipient:</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)', fontWeight: '600' }}>
            {data.phoneNumber || data.recipient || '+1-555-0199'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
          <span>Priority:</span>
          <span style={{ color: 'var(--accent-rose)' }}>{data.priority || 'CRITICAL'}</span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(SmsAlertNode);
