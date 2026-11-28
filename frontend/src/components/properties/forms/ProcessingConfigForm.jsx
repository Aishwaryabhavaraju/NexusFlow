import React from 'react';
import FormField from './FormField.jsx';

export default function ProcessingConfigForm({ nodeType, data, onChange }) {
  return (
    <div className="nf-form-stack">
      {/* Node Name */}
      <FormField label="Processor Name">
        <input
          type="text"
          className="nf-form-input"
          value={data.label || ''}
          onChange={(e) => onChange('label', e.target.value)}
          placeholder="e.g. 10-Sample Moving Avg"
        />
      </FormField>

      {/* Input Field */}
      <FormField label="Input Field" helperText="Incoming telemetry key to transform">
        <input
          type="text"
          className="nf-form-input nf-form-input--mono"
          value={data.inputField || 'sensor_telemetry'}
          onChange={(e) => onChange('inputField', e.target.value)}
          placeholder="e.g. sensor_telemetry"
        />
      </FormField>

      {/* Output Name */}
      <FormField label="Output Name" helperText="Emitted stream property name">
        <input
          type="text"
          className="nf-form-input nf-form-input--mono"
          value={data.outputName || 'smoothed_stream'}
          onChange={(e) => onChange('outputName', e.target.value)}
          placeholder="e.g. smoothed_stream"
        />
      </FormField>

      {/* Window Size (For Moving Average & Windowed processors) */}
      {(nodeType === 'movingAverage' || data.windowSize !== undefined) && (
        <FormField label="Window Size (samples)" helperText="Number of sliding data points to average">
          <input
            type="number"
            className="nf-form-input"
            value={data.windowSize || 10}
            onChange={(e) => onChange('windowSize', Number(e.target.value))}
            min="2"
            max="1000"
          />
        </FormField>
      )}

      {/* Min/Max Mode */}
      {nodeType === 'minMax' && (
        <>
          <FormField label="Extraction Mode">
            <select
              className="nf-form-select"
              value={data.mode || 'peak-to-peak'}
              onChange={(e) => onChange('mode', e.target.value)}
            >
              <option value="peak-to-peak">Peak-to-Peak Envelope</option>
              <option value="maximum-only">Maximum Peak Only</option>
              <option value="minimum-only">Minimum Valley Only</option>
            </select>
          </FormField>
          <FormField label="Window Duration">
            <input
              type="text"
              className="nf-form-input"
              value={data.windowDuration || '60s'}
              onChange={(e) => onChange('windowDuration', e.target.value)}
            />
          </FormField>
        </>
      )}

      {/* Math Operation */}
      {nodeType === 'mathOperation' && (
        <>
          <FormField label="Math Operation">
            <select
              className="nf-form-select"
              value={data.operation || 'multiply'}
              onChange={(e) => onChange('operation', e.target.value)}
            >
              <option value="multiply">Multiply (Scaling Factor)</option>
              <option value="add">Add (Offset)</option>
              <option value="divide">Divide</option>
              <option value="subtract">Subtract</option>
            </select>
          </FormField>
          <FormField label="Factor / Constant">
            <input
              type="number"
              className="nf-form-input"
              value={data.factor !== undefined ? data.factor : 1.25}
              onChange={(e) => onChange('factor', Number(e.target.value))}
              step="0.05"
            />
          </FormField>
        </>
      )}

      {/* Deadband Filter */}
      {nodeType === 'filter' && (
        <FormField label="Deadband Delta (±)" helperText="Suppress changes smaller than threshold">
          <input
            type="number"
            className="nf-form-input"
            value={data.thresholdDelta || 0.5}
            onChange={(e) => onChange('thresholdDelta', Number(e.target.value))}
            step="0.1"
          />
        </FormField>
      )}
    </div>
  );
}
