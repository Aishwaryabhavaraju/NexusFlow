import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import './BaseNode.css';

function BaseNode({
  id,
  selected,
  title,
  subtitle,
  description,
  category = 'sources',
  icon: Icon,
  hasInput = true,
  hasOutput = true,
  inputHandles = [{ id: 'input-0', position: Position.Left }],
  outputHandles = [{ id: 'output-0', position: Position.Right }],
  children
}) {
  return (
    <div
      className={`nf-node nf-node--${category} ${
        selected ? 'nf-node--selected' : ''
      }`}
    >
      {/* Category color indicator strip */}
      <div className="nf-node__color-bar" />

      {/* Target (input) connection handles */}
      {hasInput &&
        inputHandles.map((handle) => (
          <Handle
            key={handle.id}
            type="target"
            position={handle.position || Position.Left}
            id={handle.id}
            style={handle.style}
            className="nf-node__handle nf-node__handle--target"
          />
        ))}

      {/* Node Header */}
      <div className="nf-node__header">
        <div className="nf-node__icon-wrap">
          {Icon && <Icon size={16} className="nf-node__icon" />}
        </div>
        <div className="nf-node__title-group">
          <div className="nf-node__title" title={title}>{title}</div>
          {subtitle && <div className="nf-node__subtitle">{subtitle}</div>}
        </div>
      </div>

      {/* Node Body with short description and telemetry content */}
      <div className="nf-node__body">
        {description && (
          <p className="nf-node__desc" title={description}>
            {description}
          </p>
        )}
        {children}
      </div>

      {/* Source (output) connection handles */}
      {hasOutput &&
        outputHandles.map((handle) => (
          <Handle
            key={handle.id}
            type="source"
            position={handle.position || Position.Right}
            id={handle.id}
            style={handle.style}
            className="nf-node__handle nf-node__handle--source"
          />
        ))}
    </div>
  );
}

export default memo(BaseNode);
