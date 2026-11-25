import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  Workflow,
  Plus,
  Play,
  Square,
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from "lucide-react";

const WorkflowList = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runtimeStatus, setRuntimeStatus] = useState({});
  const [actionMessage, setActionMessage] = useState(null);
  const navigate = useNavigate();

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const res = await API.get("/graphs");
      setWorkflows(res.data.data);

      // Check runtime statuses for each workflow
      const statuses = {};
      for (const w of res.data.data) {
        try {
          const statusRes = await API.get(`/rules/${w._id}/status`);
          statuses[w._id] = statusRes.data.status;
        } catch (e) {
          statuses[w._id] = "stopped";
        }
      }
      setRuntimeStatus(statuses);
    } catch (err) {
      console.error("Fetch workflows error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleStartWorkflow = async (id, name) => {
    try {
      await API.post(`/rules/${id}/start`);
      setRuntimeStatus((prev) => ({ ...prev, [id]: "running" }));
      showMessage("success", `Workflow "${name}" started and compiled into active RxJS pipeline.`);
    } catch (err) {
      showMessage("error", `Could not start workflow: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleStopWorkflow = async (id, name) => {
    try {
      await API.post(`/rules/${id}/stop`);
      setRuntimeStatus((prev) => ({ ...prev, [id]: "stopped" }));
      showMessage("success", `Workflow "${name}" stopped.`);
    } catch (err) {
      showMessage("error", `Could not stop workflow: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteWorkflow = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete workflow "${name}"?`)) return;

    try {
      await API.delete(`/graphs/${id}`);
      setWorkflows((prev) => prev.filter((w) => w._id !== id));
      showMessage("success", `Workflow "${name}" deleted.`);
    } catch (err) {
      showMessage("error", `Delete failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const showMessage = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 5000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Workflow className="h-6 w-6 text-cyan-400" />
            Configured IoT Workflows
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual graphs serialized in MongoDB, compiled into active event processing pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchWorkflows}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
          <Link
            to="/builder"
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-cyan-500/20 hover:bg-cyan-400 transition-colors"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>New Workflow</span>
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium ${
            actionMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
          }`}
        >
          {actionMessage.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Workflow Table */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5 font-semibold">Workflow Name</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold">Runtime State</th>
                <th className="py-3.5 px-5 font-semibold">Nodes / Edges</th>
                <th className="py-3.5 px-5 font-semibold">Last Modified</th>
                <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {workflows.length > 0 ? (
                workflows.map((w) => {
                  const isRunning = runtimeStatus[w._id] === "running";
                  return (
                    <tr key={w._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-5">
                        <Link
                          to={`/builder/${w._id}`}
                          className="font-semibold text-slate-100 hover:text-cyan-400 transition-colors text-sm"
                        >
                          {w.name}
                        </Link>
                        {w.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {w.description}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            w.config?.isEnabled
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {w.config?.isEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono ${
                            isRunning
                              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                              : "bg-slate-800/80 text-slate-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isRunning ? "bg-cyan-400 animate-ping" : "bg-slate-500"
                            }`}
                          />
                          {isRunning ? "RUNNING" : "STOPPED"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-400 font-mono text-[11px]">
                        {w.nodes?.length || 0} nodes • {w.edges?.length || 0} edges
                      </td>
                      <td className="py-4 px-5 text-slate-400 text-[11px]">
                        {new Date(w.updatedAt || w.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isRunning ? (
                            <button
                              onClick={() => handleStopWorkflow(w._id, w.name)}
                              className="rounded-lg p-1.5 text-amber-400 hover:bg-amber-500/10"
                              title="Stop Workflow Runtime"
                            >
                              <Square className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartWorkflow(w._id, w.name)}
                              className="rounded-lg p-1.5 text-emerald-400 hover:bg-emerald-500/10"
                              title="Start Workflow Runtime"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            onClick={() => navigate(`/builder/${w._id}`)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                            title="Edit in Visual Builder"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteWorkflow(w._id, w.name)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                            title="Delete Workflow"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 text-xs">
                    {loading ? "Loading workflows..." : "No workflows found. Click 'New Workflow' to create one."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkflowList;
