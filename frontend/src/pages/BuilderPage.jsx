import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Layers, Sliders, Copy, Check, Download } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar.jsx';
import NodeLibrary from '../components/nodeLibrary/NodeLibrary.jsx';
import PropertiesPanel from '../components/properties/PropertiesPanel.jsx';
import GraphCanvas from '../components/canvas/GraphCanvas.jsx';
import ValidationBanner from '../components/validation/ValidationBanner.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import { validatePipelineGraph } from '../utils/graphValidator.js';
import { serializePipelineToJSON } from '../utils/jsonSerializer.js';
import { initialDemoNodes, initialDemoEdges } from '../utils/nodeDefaults.js';
import './BuilderPage.css';

// Rule 8: Prevent duplicate node IDs
function generateUniqueNodeId(type, existingNodes) {
  let counter = 1;
  let candidateId = `${type}-${counter}`;
  while (existingNodes.some((n) => n.id === candidateId)) {
    counter++;
    candidateId = `${type}-${counter}`;
  }
  return candidateId;
}

export default function BuilderPage({
  pipelineName,
  nodes,
  setNodes,
  onNodesChange,
  edges,
  setEdges,
  onEdgesChange,
  validationResult,
  setValidationResult,
  isExportModalOpen,
  setIsExportModalOpen,
  simMessage,
  setSimMessage
}) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  // Real-time re-validation — only when the banner is already open (not null).
  // Using a ref to hold the current validationResult avoids adding it to deps
  // which would create an infinite loop (effect → setState → re-render → effect).
  const validationResultRef = useRef(validationResult);
  useEffect(() => {
    validationResultRef.current = validationResult;
  });

  useEffect(() => {
    if (validationResultRef.current !== null) {
      const liveResult = validatePipelineGraph(nodes, edges);
      setValidationResult(liveResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, setValidationResult]);

  // Add node handler with duplicate ID prevention
  const handleAddNode = useCallback(
    (nodeDef, customPos) => {
      const newNodeId = generateUniqueNodeId(nodeDef.type, nodes);
      const position = customPos || {
        x: 180 + Math.random() * 120,
        y: 120 + Math.random() * 120
      };

      const newNode = {
        id: newNodeId,
        type: nodeDef.type,
        position,
        data: {
          ...nodeDef.defaultData,
          label: `${nodeDef.name} ${newNodeId.split('-').pop()}`
        }
      };

      setNodes((currentNodes) => [...currentNodes, newNode]);
      setSelectedNodeId(newNodeId);
    },
    [nodes, setNodes]
  );

  const handleAddNodeAtPosition = useCallback(
    (type, nodeDef, position) => {
      if (!nodeDef) return;
      handleAddNode(nodeDef, position);
    },
    [handleAddNode]
  );

  const handleUpdateNodeData = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData
              }
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }
    },
    [selectedNodeId, setNodes, setEdges]
  );

  const handleClearCanvas = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the entire canvas?')) {
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
      setValidationResult(null);
    }
  }, [setNodes, setEdges, setValidationResult]);

  // Wrap onNodesChange to also clear selectedNodeId when a node is deleted via keyboard
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      const removals = changes.filter((c) => c.type === 'remove');
      if (removals.length > 0) {
        const removedIds = new Set(removals.map((c) => c.id));
        setSelectedNodeId((prev) => (removedIds.has(prev) ? null : prev));
      }
    },
    [onNodesChange]
  );

  const handleLoadDemo = useCallback(() => {
    setNodes(initialDemoNodes);
    setEdges(initialDemoEdges);
    setSelectedNodeId(null);
    setValidationResult(null);
  }, [setNodes, setEdges, setValidationResult]);

  const exportedJsonString = JSON.stringify(
    serializePipelineToJSON(pipelineName, nodes, edges),
    null,
    2
  );

  const handleCopyJson = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(exportedJsonString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = exportedJsonString;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleDownloadJson = () => {
    const blob = new Blob([exportedJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pipelineName.toLowerCase().replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="nf-builder-page">
      {/* Topology Validation Alert Panel */}
      <ValidationBanner
        validationResult={validationResult}
        onClose={() => setValidationResult(null)}
        onSelectNode={(nodeId) => setSelectedNodeId(nodeId)}
      />

      {/* Simulation Feedback Banner */}
      {simMessage && (
        <div className="nf-sim-banner">
          <span>{simMessage}</span>
          <button className="nf-sim-banner__close" onClick={() => setSimMessage(null)}>×</button>
        </div>
      )}

      <div className="nf-builder-workspace">
        {/* Left Panel: Draggable Node Library */}
        <Sidebar
          title="Node Library"
          icon={Layers}
          position="left"
          isCollapsed={leftSidebarCollapsed}
          onToggleCollapse={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
          badge="16 Nodes"
        >
          <NodeLibrary onAddNode={(nodeDef) => handleAddNode(nodeDef)} />
        </Sidebar>

        {/* Center Canvas */}
        <div className="nf-builder-canvas-area">
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={onEdgesChange}
            setEdges={setEdges}
            selectedNodeId={selectedNodeId}
            onNodeSelect={(node) => setSelectedNodeId(node ? node.id : null)}
            onAddNodeAtPosition={handleAddNodeAtPosition}
            onDeleteNode={handleDeleteNode}
            onLoadDemo={handleLoadDemo}
            onClearCanvas={handleClearCanvas}
          />
        </div>

        {/* Right Panel: Dynamic Properties Panel */}
        <Sidebar
          title="Node Properties"
          icon={Sliders}
          position="right"
          isCollapsed={rightSidebarCollapsed}
          onToggleCollapse={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
        >
          <PropertiesPanel
            selectedNode={selectedNode}
            onUpdateNodeData={handleUpdateNodeData}
            onDeleteNode={handleDeleteNode}
          />
        </Sidebar>
      </div>

      {/* Export Pipeline JSON Spec Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title={`Pipeline JSON Specification · ${pipelineName}`}
        maxWidth="760px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {nodes.length} nodes · {edges.length} connections
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="secondary"
                size="sm"
                icon={copied ? Check : Copy}
                onClick={handleCopyJson}
              >
                {copied ? 'Copied!' : 'Copy JSON'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Download}
                onClick={handleDownloadJson}
              >
                Download JSON (.json)
              </Button>
            </div>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Serialized stream topology specification configured for <strong>Member 1's backend RxJS compiler</strong>. Any additions or edits on the canvas regenerate this specification in real time.
          </p>
        </div>
        <pre className="nf-json-viewer">
          <code>{exportedJsonString}</code>
        </pre>
      </Modal>
    </div>
  );
}
