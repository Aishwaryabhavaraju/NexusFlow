import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Workflow,
  Radio,
  Settings,
  FolderGit2
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/builder", label: "Workflow Builder", icon: Workflow },
  { path: "/workflows", label: "Workflows", icon: FolderGit2 },
  { path: "/monitoring", label: "Telemetry & Devices", icon: Radio },
  { path: "/settings", label: "Settings", icon: Settings }
];

const Sidebar = () => {
  return (
    <aside className="w-56 shrink-0 border-r border-slate-800 bg-slate-950 flex flex-col justify-between p-3 select-none">
      <div className="space-y-1">
        <p className="px-3 pt-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Core Engine
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm shadow-cyan-500/10"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-[11px]">
        <div className="flex items-center justify-between text-slate-400">
          <span>Engine State:</span>
          <span className="font-mono text-emerald-400">ACTIVE</span>
        </div>
        <div className="flex items-center justify-between text-slate-400 mt-1">
          <span>Database:</span>
          <span className="font-mono text-slate-300">Time-Series</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
