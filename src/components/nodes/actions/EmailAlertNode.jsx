import React, { memo } from 'react';
import { Mail } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function EmailAlertNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Email Alert'}
      subtitle="Action Dispatcher"
      description="Sends diagnostic event report to monitoring group."
      category="actions"
      icon={Mail}
      hasInput={true}
      hasOutput={false}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Recipient:</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-rose)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {data.recipient || 'plant-ops@nexusflow.io'}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.6875rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Subject:</span>
          <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {data.subject || '[ALERT] IIoT Pipeline Breach'}
          </span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(EmailAlertNode);
