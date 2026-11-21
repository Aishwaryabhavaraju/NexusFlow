import React, { memo } from 'react';
import { Webhook } from 'lucide-react';
import BaseNode from '../BaseNode.jsx';

function WebhookNode({ id, data, selected }) {
  return (
    <BaseNode
      id={id}
      selected={selected}
      title={data.label || 'Webhook'}
      subtitle="Action Dispatcher"
      description="Fires REST POST payload to plant SCADA/MES."
      category="actions"
      icon={Webhook}
      hasInput={true}
      hasOutput={false}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Endpoint:</span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent-rose)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={data.endpointUrl || 'https://scada.plant.internal/api/v1/trips'}
          >
            {data.endpointUrl || 'https://scada.plant.internal/api/v1/trips'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-dim)' }}>
          <span>Method:</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
            {data.method || 'POST'}
          </span>
        </div>
      </div>
    </BaseNode>
  );
}

export default memo(WebhookNode);
