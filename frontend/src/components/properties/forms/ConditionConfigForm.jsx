import React from 'react';
import FormField from './FormField.jsx';

export default function ConditionConfigForm({ nodeType, data, onChange }) {
  return (
    <div className="nf-form-stack">
      {/* Condition Name */}
      <FormField label="Condition Name">
        <input
          type="text"
          className="nf-form-input"
          value={data.label || ''}
          onChange={(e) => onChange('label', e.target.value)}
          placeholder="e.g. Overspeed Tripwire"
        />
      </FormField>

      {/* Operator */}
      <FormField label="Operator" helperText="Comparison relation against setpoint">
        <select
          className="nf-form-select"
          value={data.comparator || (nodeType === 'lessThan' ? '<' : '>')}
          onChange={(e) => onChange('comparator', e.target.value)}
        >
          <option value=">">Greater Than (&gt;)</option>
          <option value="<">Less Than (&lt;)</option>
          <option value="===">Equal To (===)</option>
          <option value=">=">Greater Than or Equal (&gt;=)</option>
          <option value="<=">Less Than or Equal (&lt;=)</option>
        </select>
      </FormField>

      {/* Threshold Value */}
      <FormField label="Threshold Value" helperText="Setpoint trip limit">
        <input
          type="number"
          className="nf-form-input nf-form-input--mono"
          value={data.limit !== undefined ? data.limit : data.value !== undefined ? data.value : 100}
          onChange={(e) => {
            const val = Number(e.target.value);
            onChange({ limit: val, value: val });
          }}
          step="0.5"
        />
      </FormField>

      {/* Unit */}
      <FormField label="Unit" helperText="Engineering unit (°C, bar, RPM, mm/s, etc.)">
        <input
          type="text"
          className="nf-form-input"
          value={data.unit || 'RPM'}
          onChange={(e) => onChange('unit', e.target.value)}
          placeholder="e.g. °C, bar, RPM"
        />
      </FormField>

      {/* Threshold Hysteresis */}
      {nodeType === 'threshold' && (
        <FormField label="Hysteresis Band (±)" helperText="Deadband to prevent rapid trip chattering">
          <input
            type="number"
            className="nf-form-input"
            value={data.hysteresis || 2.0}
            onChange={(e) => onChange('hysteresis', Number(e.target.value))}
            step="0.5"
          />
        </FormField>
      )}

      {/* Boolean Logic Operator for AND/OR */}
      {nodeType === 'andOr' && (
        <FormField label="Logic Gate" helperText="Multi-condition combiner">
          <select
            className="nf-form-select"
            value={data.logicGate || 'AND'}
            onChange={(e) => onChange('logicGate', e.target.value)}
          >
            <option value="AND">AND (Both conditions A and B must trip)</option>
            <option value="OR">OR (Either condition A or B triggers action)</option>
          </select>
        </FormField>
      )}
    </div>
  );
}
