import React from 'react';
import { Cpu, PlusCircle, Sparkles } from 'lucide-react';
import Button from '../common/Button.jsx';
import './EmptyCanvasState.css';

export default function EmptyCanvasState({ onLoadDemo }) {
  return (
    <div className="nf-empty-canvas">
      <div className="nf-empty-canvas__badge">
        <Sparkles size={14} />
        <span>Canvas Ready</span>
      </div>

      <div className="nf-empty-canvas__icon-wrap">
        <Cpu size={40} className="nf-empty-canvas__icon" />
      </div>

      <h2 className="nf-empty-canvas__title">Visual IIoT Pipeline Canvas</h2>
      <p className="nf-empty-canvas__subtitle">
        Drag sensor, processor, condition, and alert nodes from the left library onto the canvas, or load a pre-configured template.
      </p>

      <div className="nf-empty-canvas__actions">
        <Button
          variant="primary"
          size="md"
          icon={PlusCircle}
          onClick={onLoadDemo}
        >
          Load Pipeline (Turbine → Moving Avg → Threshold → SMS)
        </Button>
      </div>

      <div className="nf-empty-canvas__tips">
        <div className="nf-tip">
          <span className="nf-tip-num">1</span>
          <span>Connect <strong>Sources</strong> to <strong>Processing</strong> or <strong>Conditions</strong></span>
        </div>
        <div className="nf-tip">
          <span className="nf-tip-num">2</span>
          <span>Attach <strong>Actions</strong> to trigger alarms, SMS, or webhooks</span>
        </div>
      </div>
    </div>
  );
}
