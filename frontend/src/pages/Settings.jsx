import React from "react";
import { useAuth } from "../context/AuthContext";
import { Settings as SettingsIcon, User, ShieldCheck, Database, Server, Code } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <SettingsIcon className="h-6 w-6 text-cyan-400" />
          System & Account Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          NexusFlow Part 1 platform configuration, user profile, and API references.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <User className="h-4 w-4 text-cyan-400" />
            Operator Profile
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Name:</span>
              <span className="text-slate-200 font-medium">{user?.name || "Anonymous Operator"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Email:</span>
              <span className="text-slate-200 font-mono">{user?.email || "operator@nexusflow.io"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Role:</span>
              <span className="text-cyan-400 font-semibold uppercase">{user?.role || "operator"}</span>
            </div>
          </div>
        </div>

        {/* Database & Platform Architecture */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-400" />
            Database & Telemetry Storage
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Engine:</span>
              <span className="text-emerald-400 font-medium">MongoDB Native Time-Series</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Time Field:</span>
              <span className="font-mono text-slate-200">timestamp</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Meta Field:</span>
              <span className="font-mono text-slate-200">metadata (deviceId, metric)</span>
            </div>
          </div>
        </div>
      </div>

      {/* API Reference Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Code className="h-4 w-4 text-indigo-400" />
          Backend API Endpoints (Part 1 Foundation)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold">POST</span> /api/graphs
            <p className="text-[10px] text-slate-400 font-sans mt-1">Create and serialize React Flow graph JSON</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold">GET</span> /api/graphs
            <p className="text-[10px] text-slate-400 font-sans mt-1">Retrieve all stored IoT workflows</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold">POST</span> /api/graphs/validate
            <p className="text-[10px] text-slate-400 font-sans mt-1">Validate graph structure, types, cycles, handles</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold">POST</span> /api/telemetry
            <p className="text-[10px] text-slate-400 font-sans mt-1">Ingest single reading into Time-Series collection</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold">POST</span> /api/telemetry/bulk
            <p className="text-[10px] text-slate-400 font-sans mt-1">Bulk ingest telemetry array into Time-Series collection</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold">GET</span> /api/telemetry
            <p className="text-[10px] text-slate-400 font-sans mt-1">Query and filter telemetry readings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
