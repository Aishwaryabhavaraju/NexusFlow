import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Play, Download, Plus, Clock, Cpu, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import './PipelinesPage.css';

const samplePipelines = [
  {
    id: 'pipe-turb-01',
    name: 'Turbine Vibration & RPM Monitor',
    description: 'High-frequency telemetry stream monitoring rotor shaft speed and bearing displacement with SMS dispatch.',
    status: 'ACTIVE',
    nodeCount: 5,
    updatedAt: '10 mins ago',
    category: 'Energy & Power'
  },
  {
    id: 'pipe-cool-02',
    name: 'Coolant Heat Exchanger Interlock',
    description: 'Calculates 10-sample rolling thermal average and fires safety emergency webhook when temp > 95°C.',
    status: 'ACTIVE',
    nodeCount: 4,
    updatedAt: '1 hour ago',
    category: 'Thermodynamics'
  },
  {
    id: 'pipe-press-03',
    name: 'Hydraulic Pressure Guard',
    description: 'Deadband jitter filter connected to low/high pressure tripwire for hydraulic cylinder safety.',
    status: 'DRAFT',
    nodeCount: 6,
    updatedAt: '2 days ago',
    category: 'Hydraulics'
  }
];

export default function PipelinesPage() {
  const navigate = useNavigate();
  const [pipelines] = useState(samplePipelines);

  return (
    <div className="nf-pipelines-page">
      <div className="nf-page-header">
        <div className="nf-page-header__left">
          <h1 className="nf-page-title">Industrial IoT Pipelines</h1>
          <p className="nf-page-subtitle">
            Overview of stream graph pipelines configured in the NexusFlow visual builder.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => navigate('/')}
        >
          New Visual Pipeline
        </Button>
      </div>

      <div className="nf-pipelines-grid">
        {pipelines.map((pipe) => (
          <div key={pipe.id} className="nf-pipe-card">
            <div className="nf-pipe-card__header">
              <div className="nf-pipe-card__cat">
                <Badge variant="cyan" size="sm">{pipe.category}</Badge>
                <span className="nf-pipe-card__id">{pipe.id}</span>
              </div>
              <Badge variant={pipe.status === 'ACTIVE' ? 'green' : 'amber'} size="sm">
                {pipe.status}
              </Badge>
            </div>

            <h3 className="nf-pipe-card__title">{pipe.name}</h3>
            <p className="nf-pipe-card__desc">{pipe.description}</p>

            <div className="nf-pipe-card__meta">
              <div className="nf-meta-item">
                <Cpu size={14} />
                <span>{pipe.nodeCount} Active Nodes</span>
              </div>
              <div className="nf-meta-item">
                <Clock size={14} />
                <span>Updated {pipe.updatedAt}</span>
              </div>
            </div>

            <div className="nf-pipe-card__footer">
              <Button
                variant="secondary"
                size="sm"
                icon={Play}
                onClick={() => navigate('/')}
              >
                Open in Canvas
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
