import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import './MainLayout.css';

export default function MainLayout({
  pipelineName,
  onNameChange,
  onSave,
  onValidate,
  onExportJson,
  onRunSimulation,
  isRunDisabled,
  isSaving,
  isCompiling
}) {
  return (
    <div className="nf-app-layout">
      <Header
        pipelineName={pipelineName}
        onNameChange={onNameChange}
        onSave={onSave}
        onValidate={onValidate}
        onExportJson={onExportJson}
        onRunSimulation={onRunSimulation}
        isRunDisabled={isRunDisabled}
        isSaving={isSaving}
        isCompiling={isCompiling}
      />
      <main className="nf-main-content">
        <Outlet />
      </main>
    </div>
  );
}
