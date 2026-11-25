import React, { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { nodeTypes } from "../components/nodes";
import NodePalette from "../components/workflow/NodePalette";
import NodeConfigPanel from "../components/workflow/NodeConfigPanel";
import API from "../services/api";
import {
  Save,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Play,
  ArrowLeft,
  ChevronDown
} from "lucide-react";

const initialNodes = [
  {
    id: "sensor-1",
    type: "sensor",
    position: { x: 100, y: 180 },
    data: {
      label: "Turbine Sensor",
      deviceId: "TURBINE-001",
      metric: "temperature"
    }
  },
  {
    id: "filter-1",
    type: "movingAverage",
    position: { x: 380, y: 180 },
    data: {
      label: "Moving Average",
      windowSize: 3
    }
  },
  {
    id: "threshold-1",
    type: "threshold",
    position: { x: 660, y: 180 },
    data: {
      label: "Threshold",
      operator: "gte",
      value: 80
    }
  },
  {
    id: "action-1",
    type: "actionTrigger",
    position: { x: 940, y: 180 },
    data: {
      label: "Action Trigger",
      actionType: "alert",
      message: "High turbine temperature detected!"
    }
  }
];

const initialEdges = [
  { id: "edge-1", source: "sensor-1", target: "filter-1" },
  { id: "edge-2", source: "filter-1", target: "threshold-1" },
  { id: "edge-3", source: "threshold-1", target: "action-1" }
];

let idCounter = 10;

const WorkflowBuilderContent = () => {
  const { id: routeGraphId } = useParams();
  const navigate = useNavigate();

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [workflowId, setWorkflowId] = useState(routeGraphId || null);
  const [workflowName, setWorkflowName] = useState("Turbine Temperature Alert");
  const [workflowDesc, setWorkflowDesc] = useState("Monitors turbine temperature with moving average and triggers alert");
  const [isEnabled, setIsEnabled] = useState(true);

  const [selectedNode, setSelectedNode] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Load workflow if route ID is provided
  useEffect(() => {
    if (routeGraphId) {
      loadWorkflow(routeGraphId);
    }
  }, [routeGraphId]);

  const loadWorkflow = async (graphId) => {
    try {
      const res = await API.get(`/graphs/${graphId}`);
      const g = res.data.data;
      setWorkflowId(g._id);
      setWorkflowName(g.name);
      setWorkflowDesc(g.description || "");
      setIsEnabled(g.config?.isEnabled !== false);
      if (g.nodes && g.nodes.length > 0) {
        setNodes(g.nodes);
      }
      if (g.edges && g.edges.length > 0) {
        setEdges(g.edges);
      }
      showMessage("success", `Loaded workflow "${g.name}"`);
    } catch (err) {
      showMessage("error", `Failed to load workflow: ${err.response?.data?.message || err.message}`);
    }
  };

  const showMessage = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeData = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeId) {
            const updated = { ...n, data: { ...newData } };
            setSelectedNode(updated);
            return updated;
          }
          return n;
        })
      );
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const raw = event.dataTransfer.getData("application/reactflow");
      if (!raw) return;

      const nodeItem = JSON.parse(raw);
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });

      const newNode = {
        id: `${nodeItem.type}-${++idCounter}`,
        type: nodeItem.type,
        position,
        data: { ...nodeItem.defaultData }
      };

      setNodes((nds) => nds.concat(newNode));
      setSelectedNode(newNode);
    },
    [reactFlowInstance, setNodes]
  );

  const handleAddNodeFromPalette = (item) => {
    const newNode = {
      id: `${item.type}-${++idCounter}`,
      type: item.type,
      position: { x: 300 + Math.random() * 200, y: 150 + Math.random() * 100 },
      data: { ...item.defaultData }
    };
    setNodes((nds) => nds.concat(newNode));
    setSelectedNode(newNode);
  };

  const serializeGraph = () => {
    return {
      name: workflowName,
      description: workflowDesc,
      config: {
        version: "1.0",
        executionMode: "realtime",
        isEnabled
      },
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n.data
      })),
      edges: edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target
      }))
    };
  };

  const handleValidate = async () => {
    try {
      const graphData = serializeGraph();
      const res = await API.post("/graphs/validate", graphData);

      if (res.data.success) {
        setValidationResult({
          isValid: true,
          message: "Graph validation passed! The workflow is topologically valid and ready for execution.",
          errors: []
        });
      }
    } catch (err) {
      const errs = err.response?.data?.errors || [err.response?.data?.message || err.message];
      setValidationResult({
        isValid: false,
        message: "Validation failed. Please resolve the errors below:",
        errors: errs
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = serializeGraph();

      if (workflowId) {
        const res = await API.put(`/graphs/${workflowId}`, payload);
        showMessage("success", `Workflow "${res.data.data.name}" updated successfully in MongoDB.`);
      } else {
        const res = await API.post("/graphs", payload);
        setWorkflowId(res.data.data._id);
        navigate(`/builder/${res.data.data._id}`, { replace: true });
        showMessage("success", `Workflow "${res.data.data.name}" saved to MongoDB.`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      showMessage("error", `Save error: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleResetCanvas = () => {
    if (window.confirm("Are you sure you want to reset the canvas?")) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      setValidationResult(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Builder Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/90 px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/workflows")}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to workflows"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded px-1.5 py-0.5 border border-transparent hover:border-slate-700"
              placeholder="Workflow Name"
            />
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-slate-500">
                {workflowId ? `ID: ${workflowId}` : "Unsaved Workflow"}
              </span>
              <span className="text-slate-600">•</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-slate-400">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                Enabled
              </label>
            </div>
          </div>
        </div>

        {/* Status Message Toast */}
        {statusMessage && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
              statusMessage.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle className="h-3.5 w-3.5" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetCanvas}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleValidate}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Validate Workflow</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saving ? "Saving..." : "Save Workflow"}</span>
          </button>
        </div>
      </div>

      {/* Main Builder Area: Palette + Canvas */}
      <div className="flex flex-1 overflow-hidden relative" ref={reactFlowWrapper}>
        <NodePalette onAddNode={handleAddNodeFromPalette} />

        <div className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#1e293b" gap={20} size={1} />
            <Controls className="!bg-slate-900 !border-slate-800 !fill-slate-300 !rounded-xl !shadow-xl" />
            <MiniMap
              nodeStrokeColor="#06b6d4"
              nodeColor="#1e293b"
              maskColor="rgba(11, 15, 25, 0.7)"
              className="!bg-slate-950/80 !border-slate-800 !rounded-xl"
            />
          </ReactFlow>

          {/* Node Configuration Panel */}
          {selectedNode && (
            <NodeConfigPanel
              selectedNode={selectedNode}
              updateNodeData={updateNodeData}
              deleteNode={deleteNode}
              onClose={() => setSelectedNode(null)}
            />
          )}

          {/* Validation Result Modal / Drawer */}
          {validationResult && (
            <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-20 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/80">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {validationResult.isValid ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      {validationResult.isValid ? "Validation Successful" : "Validation Errors"}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {validationResult.message}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setValidationResult(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  &times;
                </button>
              </div>

              {!validationResult.isValid && validationResult.errors.length > 0 && (
                <div className="mt-3 max-h-40 overflow-y-auto space-y-1 rounded-lg bg-slate-950 p-2.5 border border-slate-800">
                  {validationResult.errors.map((err, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-rose-400">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const WorkflowBuilder = () => (
  <ReactFlowProvider>
    <WorkflowBuilderContent />
  </ReactFlowProvider>
);

export default WorkflowBuilder;
