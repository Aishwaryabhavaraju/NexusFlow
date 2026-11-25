import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
  Radio,
  Activity,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  Database
} from "lucide-react";

const Monitoring = () => {
  const [telemetry, setTelemetry] = useState([]);
  const [stats, setStats] = useState({ totalReadings: 0, connectedDevices: 0, devices: [], metrics: [] });
  const [loading, setLoading] = useState(true);
  const [filterDevice, setFilterDevice] = useState("");
  const [filterMetric, setFilterMetric] = useState("");

  const [mockCount, setMockCount] = useState(10);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterDevice) params.deviceId = filterDevice;
      if (filterMetric) params.metric = filterMetric;
      params.limit = 50;

      const [telemetryRes, statsRes] = await Promise.all([
        API.get("/telemetry", { params }),
        API.get("/telemetry/stats")
      ]);

      setTelemetry(telemetryRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error("Telemetry fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, [filterDevice, filterMetric]);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const res = await API.post("/telemetry/mock", { count: mockCount });
      setToastMessage(`Successfully ingested ${res.data.count} readings into MongoDB Time-Series collection.`);
      fetchTelemetry();
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      setToastMessage("Error simulating telemetry: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Radio className="h-6 w-6 text-cyan-400" />
            Device & Telemetry Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Native MongoDB Time-Series telemetry storage, ingestion validation, and device state tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchTelemetry}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <CheckCircle className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <span className="text-[11px] font-medium text-slate-400">Total Ingested Readings</span>
          <p className="text-xl font-bold text-white mt-1.5 font-mono">{stats.totalReadings}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <span className="text-[11px] font-medium text-slate-400">Monitored Devices</span>
          <p className="text-xl font-bold text-cyan-400 mt-1.5 font-mono">{stats.connectedDevices}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400">Storage Engine</span>
            <p className="text-xs font-semibold text-emerald-400 mt-1">MongoDB 8.x Time-Series</p>
          </div>
          <Database className="h-6 w-6 text-slate-600" />
        </div>
      </div>

      {/* Simulator Bar */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-semibold text-white flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            IoT Telemetry Simulation Generator
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Generates realistic sensor readings across multiple devices (TURBINE-001, PUMP-002, BOILER-003, VALVE-004)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={mockCount}
            onChange={(e) => setMockCount(parseInt(e.target.value, 10))}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="5">5 Readings</option>
            <option value="10">10 Readings</option>
            <option value="25">25 Readings</option>
            <option value="50">50 Readings</option>
          </select>

          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isSimulating ? "Ingesting..." : "Ingest Mock Telemetry"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Telemetry Table */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 shadow-xl overflow-hidden">
        {/* Filter header */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center gap-3 bg-slate-900/80">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={filterDevice}
            onChange={(e) => setFilterDevice(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="">All Devices</option>
            {stats.devices.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={filterMetric}
            onChange={(e) => setFilterMetric(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="">All Metrics</option>
            {stats.metrics.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {(filterDevice || filterMetric) && (
            <button
              onClick={() => { setFilterDevice(""); setFilterMetric(""); }}
              className="text-xs text-cyan-400 hover:underline ml-auto"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Device ID</th>
                <th className="py-3 px-4 font-semibold">Metric</th>
                <th className="py-3 px-4 font-semibold">Measured Value</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {telemetry.length > 0 ? (
                telemetry.map((row) => (
                  <tr key={row._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-4 text-slate-400">
                      {new Date(row.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-200">
                      <span className="bg-slate-800/80 px-2 py-0.5 rounded text-[11px]">
                        {row.deviceId}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-cyan-400 font-sans font-medium">
                      {row.metric}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-white">
                      {row.value}
                    </td>
                    <td className="py-2.5 px-4 font-sans">
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Ingested
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500 font-sans">
                    {loading ? "Loading telemetry..." : "No telemetry readings match your filters."}
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

export default Monitoring;
