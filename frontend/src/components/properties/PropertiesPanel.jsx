import React from 'react';
import { Trash2, Settings, Sliders } from 'lucide-react';
import Button from '../common/Button.jsx';
import Badge from '../common/Badge.jsx';
import SourceConfigForm from './forms/SourceConfigForm.jsx';
import ProcessingConfigForm from './forms/ProcessingConfigForm.jsx';
import ConditionConfigForm from './forms/ConditionConfigForm.jsx';
import ActionConfigForm from './forms/ActionConfigForm.jsx';
import { getNodeDefinition } from '../../utils/nodeCatalog.js';
import './PropertiesPanel.css';

export default function PropertiesPanel({
  selectedNode,
  onUpdateNodeData,
  onDeleteNode
}) {
  // Empty State: when no node is selected
  if (!selectedNode) {
    return (
      <div className="nf-props-empty">
        <div className="nf-props-empty__icon-wrap">
          <Settings size={28} className="nf-props-empty__icon" />
        </div>
        <h4 className="nf-props-empty__title">No Node Selected</h4>
        <p className="nf-props-empty__desc">
          Click any node on the React Flow canvas to inspect and configure its operational telemetry, thresholds, and parameters.
        </p>
      </div>
    );
  }

  const def = getNodeDefinition(selectedNode.type) || {};
  const data = selectedNode.data || {};

  // Propagate changes directly into React Flow node.data
  // Supports both single field (field, value) and multi-field object ({ field: value, ... })
  const handleFieldChange = (fieldOrUpdates, value) => {
    if (typeof fieldOrUpdates === 'object' && fieldOrUpdates !== null) {
      onUpdateNodeData(selectedNode.id, fieldOrUpdates);
    } else {
      onUpdateNodeData(selectedNode.id, {
        [fieldOrUpdates]: value
      });
    }
  };

  const renderConfigForm = () => {
    switch (def.category) {
      case 'sources':
        return (
          <SourceConfigForm
            nodeId={selectedNode.id}
            data={data}
            onChange={handleFieldChange}
          />
        );
      case 'processing':
        return (
          <ProcessingConfigForm
            nodeType={selectedNode.type}
            data={data}
            onChange={handleFieldChange}
          />
        );
      case 'conditions':
        return (
          <ConditionConfigForm
            nodeType={selectedNode.type}
            data={data}
            onChange={handleFieldChange}
          />
        );
      case 'actions':
        return (
          <ActionConfigForm
            nodeType={selectedNode.type}
            data={data}
            onChange={handleFieldChange}
          />
        );
      default:
        return (
          <div className="nf-form-stack">
            <div className="nf-form-group">
              <label className="nf-form-label">Node Label</label>
              <input
                type="text"
                className="nf-form-input"
                value={data.label || ''}
                onChange={(e) => handleFieldChange('label', e.target.value)}
              />
            </div>
          </div>
        );
    }
  };

  const categoryBadgeVariant =
    def.category === 'sources'
      ? 'cyan'
      : def.category === 'processing'
      ? 'green'
      : def.category === 'conditions'
      ? 'amber'
      : 'rose';

  return (
    <div className="nf-props-panel">
      {/* Node Metadata Section */}
      <div className="nf-props-section">
        <div className="nf-props-meta">
          <Badge variant={categoryBadgeVariant} size="sm">
            {def.category || 'node'}
          </Badge>
          <span className="nf-props-id">{selectedNode.id}</span>
        </div>
        <h3 className="nf-props-title">{data.label || def.name}</h3>
        <p className="nf-props-desc">{def.description}</p>
      </div>

      {/* Dynamic Node Configuration Form */}
      <div className="nf-props-section nf-props-form">
        <div className="nf-props-form-header">
          <Sliders size={14} className="nf-props-form-icon" />
          <h4 className="nf-props-subtitle">Configuration Parameters</h4>
        </div>
        {renderConfigForm()}
      </div>

      {/* Delete / Actions Footer */}
      <div className="nf-props-footer">
        <Button
          variant="danger"
          size="md"
          icon={Trash2}
          onClick={() => onDeleteNode(selectedNode.id)}
          className="nf-btn-full"
        >
          Delete Node
        </Button>
      </div>
    </div>
  );
}
