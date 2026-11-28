import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Flame, Activity, Zap, ShieldAlert } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import './TemplatesPage.css';

const pipelineTemplates = [
  {
    id: 'tpl-turbine-speed',
    name: 'Turbine Overspeed & Vibration Protection',
    icon: Zap,
    difficulty: 'Production Ready',
    nodes: 5,
    description: 'Monitors turbine shaft RPM & vibration accelerometers, applies 10-sample moving average, checks > 2200 RPM threshold, and triggers floor technician SMS plus emergency audit event.',
    category: 'Rotating Machinery'
  },
  {
    id: 'tpl-thermal-runaway',
    name: 'Cooling Loop Thermal Runaway Detector',
    icon: Flame,
    difficulty: 'Critical Safety',
    nodes: 4,
    description: 'Reads thermocouple probes inside coolant circuit, tracks peak temperature envelopes, triggers when temp > 95°C, and sends immediate alert to on-duty engineering email.',
    category: 'Thermodynamics'
  },
  {
    id: 'tpl-hydraulic-burst',
    name: 'Hydraulic Line Burst Interlock',
    icon: Activity,
    difficulty: 'High Speed',
    nodes: 4,
    description: 'Monitors hydraulic line pressure transmitter, applies deadband jitter suppression, trips on sudden pressure drop < 30 bar, and posts SCADA REST webhook.',
    category: 'Fluid Dynamics'
  },
  {
    id: 'tpl-predictive-maintenance',
    name: 'Bearing Fatigue Predictive Monitor',
    icon: ShieldAlert,
    difficulty: 'Advanced Analytics',
    nodes: 6,
    description: 'Multi-sensor fusion pipeline combining vibration RMS and casing temperature, evaluating dual logic gate (AND), and recording periodic time-series metrics.',
    category: 'Predictive Maintenance'
  }
];

export default function TemplatesPage() {
  const navigate = useNavigate();

  return (
    <div className="nf-templates-page">
      <div className="nf-page-header">
        <div>
          <h1 className="nf-page-title">Industrial IoT Pipeline Templates</h1>
          <p className="nf-page-subtitle">
            Pre-engineered stream processing topologies for power plants, oil & gas, and industrial manufacturing.
          </p>
        </div>
      </div>

      <div className="nf-templates-grid">
        {pipelineTemplates.map((tpl) => {
          const Icon = tpl.icon;
          return (
            <div key={tpl.id} className="nf-tpl-card">
              <div className="nf-tpl-card__header">
                <div className="nf-tpl-card__icon-wrap">
                  <Icon size={20} className="nf-tpl-card__icon" />
                </div>
                <Badge variant="cyan" size="sm">{tpl.difficulty}</Badge>
              </div>

              <div className="nf-tpl-card__cat-label">{tpl.category}</div>
              <h3 className="nf-tpl-card__title">{tpl.name}</h3>
              <p className="nf-tpl-card__desc">{tpl.description}</p>

              <div className="nf-tpl-card__footer">
                <span className="nf-tpl-card__count">{tpl.nodes} Pipeline Nodes</span>
                <Button
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  onClick={() => navigate('/')}
                >
                  Load Template
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
