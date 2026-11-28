import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Cpu,
  GitBranch,
  Layers,
  FileCode,
  Menu,
  X,
  Play,
  Save,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import Button from '../common/Button.jsx';
import Badge from '../common/Badge.jsx';
import './Header.css';

export default function Header({
  pipelineName = 'IIoT Stream Pipeline v1',
  onNameChange,
  onSave,
  onValidate,
  onExportJson,
  onRunSimulation,
  isRunDisabled = false,
  isSaving = false,
  isCompiling = false
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isBuilder = location.pathname === '/' || location.pathname === '/builder';

  return (
    <header className="nf-header">
      <div className="nf-header__left">
        <NavLink to="/" className="nf-header__brand">
          <div className="nf-header__logo-wrap">
            <Cpu className="nf-header__logo-icon" size={22} />
          </div>
          <div className="nf-header__brand-info">
            <span className="nf-header__title">NexusFlow</span>
          </div>
        </NavLink>

        <nav className="nf-header__nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nf-nav-link ${isActive ? 'nf-nav-link--active' : ''}`
            }
          >
            <GitBranch size={15} />
            <span>Graph Builder</span>
          </NavLink>
          <NavLink
            to="/pipelines"
            className={({ isActive }) =>
              `nf-nav-link ${isActive ? 'nf-nav-link--active' : ''}`
            }
          >
            <Layers size={15} />
            <span>Pipelines</span>
          </NavLink>
          <NavLink
            to="/templates"
            className={({ isActive }) =>
              `nf-nav-link ${isActive ? 'nf-nav-link--active' : ''}`
            }
          >
            <FileCode size={15} />
            <span>Templates</span>
          </NavLink>
        </nav>
      </div>

      {isBuilder && (
        <div className="nf-header__center">
          <div className="nf-pipeline-name-box">
            <span className="nf-pipeline-tag">PIPELINE:</span>
            <input
              type="text"
              className="nf-pipeline-name-input"
              value={pipelineName}
              onChange={(e) => onNameChange?.(e.target.value)}
              placeholder="Enter pipeline name..."
            />
          </div>
        </div>
      )}

      <div className="nf-header__right">
        {isBuilder ? (
          <div className="nf-header__actions">
            <Button
              variant="secondary"
              size="sm"
              icon={CheckCircle2}
              onClick={onValidate}
              title="Validate Pipeline Topology"
            >
              Validate
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={FileCode}
              onClick={onExportJson}
              title="Show Generated Pipeline JSON Spec for Member 1"
            >
              Show JSON
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={isSaving ? Loader2 : Save}
              onClick={onSave}
              disabled={isSaving || isCompiling}
              title="Save Pipeline Configuration"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant={isRunDisabled ? 'danger' : 'primary'}
              size="sm"
              icon={isCompiling ? Loader2 : Play}
              onClick={onRunSimulation}
              disabled={isRunDisabled || isSaving || isCompiling}
              title={
                isRunDisabled
                  ? 'Cannot Run: Pipeline has validation errors. Fix them to proceed.'
                  : 'Submit and Compile Pipeline with Member 1'
              }
            >
              {isCompiling ? 'Compiling...' : 'Run Pipeline'}
            </Button>
          </div>
        ) : (
          <div className="nf-header__context-badge">
            <span className="nf-status-dot"></span>
            <span className="nf-context-text">IIoT Engine Ready</span>
          </div>
        )}

        <button
          className="nf-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="nf-mobile-drawer">
          <div className="nf-mobile-nav">
            <NavLink
              to="/"
              className="nf-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <GitBranch size={16} />
              <span>Graph Builder</span>
            </NavLink>
            <NavLink
              to="/pipelines"
              className="nf-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Layers size={16} />
              <span>Pipelines</span>
            </NavLink>
            <NavLink
              to="/templates"
              className="nf-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileCode size={16} />
              <span>Templates</span>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
