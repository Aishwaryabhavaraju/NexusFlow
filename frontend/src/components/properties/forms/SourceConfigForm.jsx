import React from 'react';
import FormField from './FormField.jsx';

export default function SourceConfigForm({ nodeId, data, onChange }) {
  return (
    <div className="nf-form-stack">
      {/* Sensor Name */}
      <FormField label="Sensor Name" helperText="Human-readable title displayed on node card">
        <input
          type="text"
          className="nf-form-input"
          value={data.label || ''}
          onChange={(e) => onChange('label', e.target.value)}
          placeholder="e.g. Turbine Rotor Main"
        />
      </FormField>

      {/* Sensor ID */}
      <FormField label="Sensor ID" helperText="Unique immutable hardware/stream identifier">
        <input
          type="text"
          className="nf-form-input nf-form-input--readonly"
          value={nodeId || ''}
          readOnly
        />
      </FormField>

      {/* Description */}
      <FormField label="Description" helperText="Operational telemetry context">
        <textarea
          className="nf-form-textarea"
          rows={2}
          value={data.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Telemetry probe description..."
        />
      </FormField>

      {/* Measurement Unit */}
      <FormField label="Measurement Unit" helperText="Physical unit of measure">
        <input
          type="text"
          className="nf-form-input"
          value={data.unit || ''}
          onChange={(e) => onChange('unit', e.target.value)}
          placeholder="e.g. RPM, °C, bar, mm/s"
        />
      </FormField>

      {/* Sampling Rate */}
      <FormField label="Sampling Rate (ms)" helperText="Transmission interval in milliseconds">
        <input
          type="number"
          className="nf-form-input"
          value={data.samplingRate || 100}
          onChange={(e) => onChange('samplingRate', Number(e.target.value))}
          min="10"
          step="10"
        />
      </FormField>

      {/* Current Value / Readout */}
      <FormField label="Live Value Simulation" helperText="Current stream value readout">
        <input
          type="number"
          className="nf-form-input nf-form-input--mono"
          value={data.currentValue !== undefined ? data.currentValue : 0}
          onChange={(e) => onChange('currentValue', Number(e.target.value))}
          step="0.5"
        />
      </FormField>
    </div>
  );
}
