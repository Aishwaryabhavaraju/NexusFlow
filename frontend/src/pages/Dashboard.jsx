import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import {
  Workflow,
  Radio,
  Activity,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Plus,
  Play,
  TrendingUp
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    activeWorkflows: 0,
    connectedDevices: 0,
    totalReadings: 0,
    recentAlerts: [],
    recentTelemetry: [],
    recentWorkflows: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const res = await API.get("/dashboard/stats");
      setStats(res.data.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();

    // Listen to telemetry simulated events
    const handleUpdate = () => fetchDashboardStats();
    window.addEventListener("nexusflow:telemetry_updated", handleUpdate);
    return () => window.removeEventListener("nexusflow:telemetry_updated", handleUpdate);
  }, []);

  const chartData = stats.recentTelemetry
    .slice()
    .reverse()
    .map((r, idx) => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      value: r.value,
      metric: r.metric,
      deviceId: r.deviceId
    }));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            IoT Telemetry & Rule Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time visual stream compilation, device telemetry, and automated threshold alerts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboardStats}
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
            <span>Create Workflow</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Workflows */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Workflows</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Workflow className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3 font-mono">{stats.totalWorkflows}</p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 font-medium">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>{stats.activeWorkflows} active in runtime</span>
          </div>
        </div>

        {/* Connected Devices */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Connected Devices</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Radio className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3 font-mono">{stats.connectedDevices}</p>
          <p className="text-[11px] text-slate-500 mt-2">Active telemetry sources</p>
        </div>

        {/* Total Readings */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Telemetry Ingested</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3 font-mono">{stats.totalReadings}</p>
          <p className="text-[11px] text-slate-500 mt-2">MongoDB Time-Series collection</p>
        </div>

        {/* Recent Alerts */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Recent Alerts</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-3 font-mono">{stats.recentAlerts.length}</p>
          <p className="text-[11px] text-rose-400/80 mt-2">Threshold events triggered</p>
        </div>
      </div>

      {/* Main Charts & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Telemetry Stream Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                Live Ingested Telemetry Feed
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Native Time-Series readings streamed from IoT nodes
              </p>
            </div>
            <Link
              to="/monitoring"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="telemetryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.75rem", fontSize: "11px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#telemetryGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-slate-500 text-xs">
                <Activity className="h-8 w-8 text-slate-600 mb-2" />
                <span>No telemetry ingested yet.</span>
                <span className="text-[11px] text-slate-600">Click "Simulate Telemetry" in the top bar to generate readings.</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Alerts Feed */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-xl flex flex-col">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            Triggered Threshold Alerts
          </h3>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {stats.recentAlerts.length > 0 ? (
              stats.recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3.5"
                >
                  <div className="flex items-center justify-between text-[10px] text-rose-400 font-medium">
                    <span className="font-mono bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-900/40">
                      {alert.deviceId}
                    </span>
                    <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1.5 font-medium leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex h-40 flex-col items-center justify-center text-slate-500 text-xs text-center">
                <p>No active alerts.</p>
                <p className="text-[10px] text-slate-600 mt-1">Rule conditions are within safe thresholds.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Workflows Section */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Workflow className="h-4 w-4 text-cyan-400" />
            Recent IoT Pipeline Workflows
          </h3>
          <Link
            to="/workflows"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All Workflows</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {stats.recentWorkflows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recentWorkflows.map((w) => (
              <div
                key={w._id}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white">{w.name}</h4>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        w.config?.isEnabled
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {w.config?.isEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5">
                    {w.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    {w.nodes?.length || 0} Nodes • {w.edges?.length || 0} Edges
                  </span>
                  <Link
                    to={`/builder/${w._id}`}
                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Open Canvas &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs">
            <p>No workflows created yet.</p>
            <Link
              to="/builder"
              className="mt-2 inline-block text-cyan-400 hover:underline"
            >
              Create your first workflow in the visual builder &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
