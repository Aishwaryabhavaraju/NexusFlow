import React from 'react';
import FormField from './FormField.jsx';

export default function ActionConfigForm({ nodeType, data, onChange }) {
  return (
    <div className="nf-form-stack">
      {/* Alert Name */}
      <FormField label="Alert / Action Name">
        <input
          type="text"
          className="nf-form-input"
          value={data.label || ''}
          onChange={(e) => onChange('label', e.target.value)}
          placeholder="e.g. Floor Engineer SMS Alert"
        />
      </FormField>

      {/* Phone Number (SMS Alert) */}
      {nodeType === 'smsAlert' && (
        <>
          <FormField label="Phone Number" helperText="SMS recipient with country code">
            <input
              type="tel"
              className="nf-form-input nf-form-input--mono"
              value={data.phoneNumber || data.recipient || '+1-555-0199'}
              onChange={(e) => {
                const val = e.target.value;
                onChange({ phoneNumber: val, recipient: val });
              }}
              placeholder="+1-555-0199"
            />
          </FormField>
          <FormField label="Message" helperText="Notification payload template">
            <textarea
              className="nf-form-textarea"
              rows={3}
              value={data.message || '[ALERT] Critical threshold reached on monitored stream.'}
              onChange={(e) => onChange('message', e.target.value)}
              placeholder="Enter SMS alert message..."
            />
          </FormField>
          <FormField label="Priority Level">
            <select
              className="nf-form-select"
              value={data.priority || 'CRITICAL'}
              onChange={(e) => onChange('priority', e.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </FormField>
        </>
      )}

      {/* Email Alert */}
      {nodeType === 'emailAlert' && (
        <>
          <FormField label="Recipient Email" helperText="Operations or engineering email address">
            <input
              type="email"
              className="nf-form-input"
              value={data.recipient || 'plant-ops@nexusflow.io'}
              onChange={(e) => onChange('recipient', e.target.value)}
              placeholder="ops@nexusflow.io"
            />
          </FormField>
          <FormField label="Email Subject">
            <input
              type="text"
              className="nf-form-input"
              value={data.subject || '[ALERT] IIoT Pipeline Breach'}
              onChange={(e) => onChange('subject', e.target.value)}
            />
          </FormField>
          <FormField label="Email Message Body">
            <textarea
              className="nf-form-textarea"
              rows={3}
              value={data.message || 'Telemetry breached safe operating envelope. Immediate technician inspection required.'}
              onChange={(e) => onChange('message', e.target.value)}
            />
          </FormField>
        </>
      )}

      {/* SCADA Webhook */}
      {nodeType === 'webhook' && (
        <>
          <FormField label="SCADA Webhook URL" helperText="REST endpoint destination">
            <input
              type="url"
              className="nf-form-input nf-form-input--mono"
              value={data.endpointUrl || 'https://scada.plant.internal/api/v1/trips'}
              onChange={(e) => onChange('endpointUrl', e.target.value)}
              placeholder="https://scada..."
            />
          </FormField>
          <FormField label="HTTP Method">
            <select
              className="nf-form-select"
              value={data.method || 'POST'}
              onChange={(e) => onChange('method', e.target.value)}
            >
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
            </select>
          </FormField>
        </>
      )}

      {/* Log Event */}
      {nodeType === 'logEvent' && (
        <>
          <FormField label="Log Severity Level">
            <select
              className="nf-form-select"
              value={data.logLevel || 'WARN'}
              onChange={(e) => onChange('logLevel', e.target.value)}
            >
              <option value="INFO">INFO (Nominal event)</option>
              <option value="WARN">WARN (Warning envelope)</option>
              <option value="CRITICAL">CRITICAL (Emergency trip)</option>
            </select>
          </FormField>
          <FormField label="Audit Retention (days)">
            <input
              type="number"
              className="nf-form-input"
              value={data.retentionDays || 30}
              onChange={(e) => onChange('retentionDays', Number(e.target.value))}
              min="1"
            />
          </FormField>
        </>
      )}
    </div>
  );
}
