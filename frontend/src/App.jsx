import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useNodesState, useEdgesState } from '@xyflow/react';
import MainLayout from './components/layout/MainLayout.jsx';
import BuilderPage from './pages/BuilderPage.jsx';
import PipelinesPage from './pages/PipelinesPage.jsx';
import TemplatesPage from './pages/TemplatesPage.jsx';
import { validatePipelineGraph } from './utils/graphValidator.js';
import { serializePipelineToJSON } from './utils/jsonSerializer.js';
import { initialDemoNodes, initialDemoEdges } from './utils/nodeDefaults.js';
import { submitPipelineToCompiler, savePipeline } from './services/pipelineApi.js';
import './App.css';

export default function App() {
  const [pipelineName, setPipelineName] = useState('Turbine Vibration & Safety Interlock v1');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialDemoNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialDemoEdges);

  const [validationResult, setValidationResult] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [simMessage, setSimMessage] = useState(null);

  // Loading states for async API actions
  const [isSaving, setIsSaving] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  // Validate handler triggered from Header
  const handleValidatePipeline = () => {
    const result = validatePipelineGraph(nodes, edges);
    setValidationResult(result);
    return result;
  };

  // Requirement 9: Validate the graph before allowing it to be saved
  const handleSavePipeline = async () => {
    const result = validatePipelineGraph(nodes, edges);
    setValidationResult(result);

    if (!result.isValid) {
      setSimMessage(
        `[BLOCKED] Save Aborted: Cannot save pipeline with ${result.errors.length} validation error(s). All topological errors must be resolved first.`
      );
      return;
    }

    setIsSaving(true);
    const serialized = serializePipelineToJSON(pipelineName, nodes, edges);

    try {
      localStorage.setItem('nexusflow_saved_pipeline', JSON.stringify(serialized));
      const res = await savePipeline(serialized);

      if (res.success) {
        setSimMessage(
          res.isPlaceholder
            ? `[SAVED LOCALLY] Pipeline "${pipelineName}" validated & cached in frontend state. (Member 2 backend offline).`
            : `[SAVED] Pipeline "${pipelineName}" successfully persisted to backend storage.`
        );
      } else {
        setSimMessage(`[ERROR] Save failed: ${res.error}`);
      }
    } catch (e) {
      setSimMessage(`[ERROR] Save failed: ${e.message}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSimMessage(null), 5000);
    }
  };

  const handleExportJson = () => {
    setIsExportModalOpen(true);
  };

  // Rule 10: Do not allow the Run button to proceed when validation fails
  // Submits the pipeline to Member 1's backend compiler
  const handleRunSimulation = async () => {
    const result = validatePipelineGraph(nodes, edges);
    setValidationResult(result);

    if (!result.isValid) {
      setSimMessage(
        `[BLOCKED] Run Aborted: Pipeline failed validation (${result.errors.length} error${
          result.errors.length > 1 ? 's' : ''
        }). Correct the errors in the validation panel to proceed.`
      );
      return;
    }

    setIsCompiling(true);
    const serialized = serializePipelineToJSON(pipelineName, nodes, edges);

    try {
      const res = await submitPipelineToCompiler(serialized);

      if (res.success) {
        if (res.isPlaceholder) {
          setSimMessage(
            `[SIMULATION ACTIVE] ${res.data.message} Active telemetry stream: Turbine (2450 RPM) -> Moving Average -> Limit > 2200 RPM -> SMS Alert.`
          );
        } else {
          setSimMessage(
            `[COMPILER SUCCESS] Member 1 RxJS compiler execution initiated (Stream ID: ${
              res.data.executionId || res.data.id || 'OK'
            }).`
          );
        }
      } else {
        setSimMessage(`[COMPILER REJECTED] Member 1 compiler returned an error: ${res.error}`);
      }
    } catch (e) {
      setSimMessage(`[SUBMISSION ERROR] Failed to connect to compiler: ${e.message}`);
    } finally {
      setIsCompiling(false);
      setTimeout(() => setSimMessage(null), 8000);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <MainLayout
              pipelineName={pipelineName}
              onNameChange={setPipelineName}
              onSave={handleSavePipeline}
              onValidate={handleValidatePipeline}
              onExportJson={handleExportJson}
              onRunSimulation={handleRunSimulation}
              isRunDisabled={validationResult && !validationResult.isValid}
              isSaving={isSaving}
              isCompiling={isCompiling}
            />
          }
        >
          <Route
            path="/"
            element={
              <BuilderPage
                pipelineName={pipelineName}
                nodes={nodes}
                setNodes={setNodes}
                onNodesChange={onNodesChange}
                edges={edges}
                setEdges={setEdges}
                onEdgesChange={onEdgesChange}
                validationResult={validationResult}
                setValidationResult={setValidationResult}
                isExportModalOpen={isExportModalOpen}
                setIsExportModalOpen={setIsExportModalOpen}
                simMessage={simMessage}
                setSimMessage={setSimMessage}
                onValidate={handleValidatePipeline}
              />
            }
          />
          <Route path="/builder" element={<Navigate to="/" replace />} />
          <Route path="/pipelines" element={<PipelinesPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
