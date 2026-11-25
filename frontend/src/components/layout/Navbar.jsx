import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Bell,
  Cpu,
  LogOut,
  User,
  Activity,
  Plus
} from "lucide-react";
import API from "../../services/api";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSimulateTelemetry = async () => {
    try {
      await API.post("/telemetry/mock", { count: 8 });
      window.dispatchEvent(new CustomEvent("nexusflow:telemetry_updated"));
    } catch (err) {
      console.error("Telemetry simulation error:", err);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & System Status */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              Nexus<span className="text-cyan-400 font-extrabold">Flow</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono text-cyan-400/80 bg-cyan-950/80 border border-cyan-800/40 px-1.5 py-0.5 rounded">
              v1.0 IoT Engine
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-800 pl-6">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Cluster Status:</span>
          <span className="font-mono text-emerald-400 font-medium">HEALTHY</span>
        </div>
      </div>

      {/* Right Controls & User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Ingest Button */}
        <button
          onClick={handleSimulateTelemetry}
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all"
          title="Generates mock IoT telemetry events directly into MongoDB"
        >
          <Activity className="h-3.5 w-3.5 text-cyan-400" />
          <span>Simulate Telemetry</span>
        </button>

        <button
          onClick={() => navigate("/builder")}
          className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-cyan-500/20 hover:bg-cyan-400 transition-colors"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>New Workflow</span>
        </button>

        {/* User Info / Logout */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-3">
          <div className="hidden md:block text-right">
            <p className="text-xs font-medium text-slate-200">{user?.name || "IoT Engineer"}</p>
            <p className="text-[10px] font-mono text-slate-500 capitalize">{user?.role || "Operator"}</p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
