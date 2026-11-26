import React, { useState } from 'react';
import { Activity, Bell, History, Settings, ChevronLeft, ChevronRight, Cpu, Menu, X } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',      icon: Activity },
  { id: 'history',      label: 'Alert History',  icon: History  },
];

export default function Sidebar({ activePage, onNavigate }) {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { unreadCount } = useAlerts();
  const { isDark } = useTheme();

  const bg      = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const text     = isDark ? 'text-slate-200' : 'text-slate-700';
  const subtext  = isDark ? 'text-slate-500' : 'text-slate-400';
  const hover    = isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100';
  const active   = isDark ? 'bg-cyan-900/40 text-cyan-400 border-cyan-500' : 'bg-cyan-50 text-cyan-700 border-cyan-500';
  const inactive = isDark ? `${text} border-transparent ${hover}` : `${text} border-transparent ${hover}`;

  const NavContent = () => (
    <nav className="flex flex-col gap-1 flex-1">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => { onNavigate(id); setMobileOpen(false); }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200 text-left ${activePage === id ? active : inactive}`}
        >
          <div className="relative shrink-0">
            <Icon size={18} />
            {id === 'history' && unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          {!collapsed && <span className="text-sm font-medium truncate">{label}</span>}
        </button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b ${bg}`}>
        <div className="flex items-center gap-2">
          <div className="bg-cyan-500/20 p-1.5 rounded-lg border border-cyan-500/30">
            <Cpu size={16} className="text-cyan-400" />
          </div>
          <span className={`font-bold text-sm ${text}`}>NexusFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(v => !v)} className={`p-2 rounded-lg ${hover} ${text}`}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full z-40 w-64 flex flex-col border-r transition-transform duration-300 ${bg}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 pt-16 flex flex-col h-full">
          <NavContent />
          <div className="mt-4 pt-4 border-t border-slate-800">
            <ThemeToggle showLabel />
          </div>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col border-r transition-all duration-300 ${bg} ${collapsed ? 'w-16' : 'w-56'}`}>
        {/* Logo */}
        <div className={`flex items-center gap-2 p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="bg-cyan-500/20 p-1.5 rounded-lg border border-cyan-500/30 shrink-0">
            <Cpu size={16} className="text-cyan-400" />
          </div>
          {!collapsed && <span className={`font-bold text-sm ${text}`}>NexusFlow</span>}
        </div>

        <div className="flex flex-col flex-1 p-3 gap-4">
          <NavContent />

          <div className={`mt-auto pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} flex flex-col gap-2`}>
            {!collapsed && <ThemeToggle showLabel />}
            {collapsed && <ThemeToggle />}
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className={`flex items-center justify-center p-3 border-t text-xs gap-1 transition-colors ${isDark ? 'border-slate-800 text-slate-500 hover:text-slate-200' : 'border-slate-200 text-slate-400 hover:text-slate-700'}`}
        >
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
        </button>
      </aside>
    </>
  );
}
