import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, X, Eye } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import './ValidationBanner.css';

export default function ValidationBanner({
  validationResult,
  onClose,
  onSelectNode
}) {
  if (!validationResult) return null;

  const { isValid, errors = [], warnings = [], stats } = validationResult;

  if (isValid && warnings.length === 0) {
    return (
      <div className="nf-val-panel nf-val-panel--success">
        <div className="nf-val-panel__header">
          <div className="nf-val-panel__title-wrap">
            <CheckCircle2 size={18} className="nf-val-icon--success" />
            <h4 className="nf-val-panel__title">Pipeline Topology Valid</h4>
            <Badge variant="green" size="sm">All 10 Rules Passed</Badge>
          </div>
          <button className="nf-val-panel__close" onClick={onClose} aria-label="Close panel">
            <X size={16} />
          </button>
        </div>
        <p className="nf-val-panel__desc">
          Ready for Member 1 backend RxJS stream compiler. Graph contains {stats?.sources || 0} Data Sources, {stats?.processing || 0} Processors, {stats?.conditions || 0} Conditions, and {stats?.actions || 0} Actions.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`nf-val-panel ${
        errors.length > 0 ? 'nf-val-panel--error' : 'nf-val-panel--warning'
      }`}
    >
      <div className="nf-val-panel__header">
        <div className="nf-val-panel__title-wrap">
          {errors.length > 0 ? (
            <AlertCircle size={18} className="nf-val-icon--error" />
          ) : (
            <AlertTriangle size={18} className="nf-val-icon--warning" />
          )}
          <h4 className="nf-val-panel__title">
            {errors.length > 0
              ? `Validation Failed (${errors.length} Error${errors.length > 1 ? 's' : ''})`
              : `Pipeline Warnings (${warnings.length})`}
          </h4>
          {errors.length > 0 && <Badge variant="rose" size="sm">{errors.length} Errors</Badge>}
          {warnings.length > 0 && <Badge variant="amber" size="sm">{warnings.length} Warnings</Badge>}
        </div>
        <button className="nf-val-panel__close" onClick={onClose} aria-label="Close panel">
          <X size={16} />
        </button>
      </div>

      <div className="nf-val-panel__body">
        {errors.map((item, idx) => (
          <div key={`err-${idx}`} className="nf-val-item nf-val-item--err">
            <span className="nf-val-rule-tag">{item.rule}</span>
            <span className="nf-val-msg">{item.message}</span>
            {item.nodeId && onSelectNode && (
              <button
                className="nf-val-focus-btn"
                onClick={() => onSelectNode(item.nodeId)}
                title="Select and inspect this node"
              >
                <Eye size={12} />
                <span>Locate</span>
              </button>
            )}
          </div>
        ))}

        {warnings.map((item, idx) => (
          <div key={`warn-${idx}`} className="nf-val-item nf-val-item--warn">
            <span className="nf-val-rule-tag">{item.rule}</span>
            <span className="nf-val-msg">{item.message}</span>
            {item.nodeId && onSelectNode && (
              <button
                className="nf-val-focus-btn"
                onClick={() => onSelectNode(item.nodeId)}
                title="Select and inspect this node"
              >
                <Eye size={12} />
                <span>Locate</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
