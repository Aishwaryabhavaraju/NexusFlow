import React, { useState } from 'react';
import { Bell, BellOff, Check, Trash2, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';

const SEVERITY_STYLES = {
  critical: 'border-l-red-500 bg-red-950/30',
  warn:     'border-l-yellow-500 bg-yellow-950/20',
  info:     'border-l-blue-500 bg-blue-950/20',
};
const BADGE_STYLES = {
  critical: 'bg-red-700 text-red-100',
  warn:     'bg-yellow-700 text-yellow-100',
  info:     'bg-blue-700 text-blue-100',
};

function AlertRow({ alert, onAck }) {
  const [expanded, setExpanded] = useState(false);
  const style = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.info;
  const badge = BADGE_STYLES[alert.severity]    ?? BADGE_STYLES.info;
  return (
    <div className={`border-l-4 rounded-r-lg p-3 transition-opacity duration-500 ${style} ${alert.acknowledged ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge}`}>{(alert.severity ?? 'INFO').toUpperCase()}</span>
            <span className="text-xs font-semibold text-slate-200 capitalize truncate">{alert.sensor ?? 'System'}</span>
            <span className="text-[10px] text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{alert.message}</p>
          {expanded && alert.value != null && (
            <p className="text-[10px] text-slate-400 mt-1">
              Value: <strong className="text-slate-200">{alert.value}</strong>
              {alert.threshold != null && <> · Threshold: <strong className="text-slate-200">{alert.threshold}</strong></>}
            </p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={() => setExpanded(v => !v)} className="p-1 rounded hover:bg-slate-700 text-slate-400">
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {!alert.acknowledged && (
            <button onClick={() => onAck(alert.id)} className="p-1 rounded hover:bg-green-800 text-green-400"><Check size={13} /></button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AlertPanel() {
  const { alerts, unreadCount, todayCounts, soundEnabled, toggleSound, acknowledge, clearAll } = useAlerts();
  const [filter, setFilter] = useState('all');

  const filtered = alerts.filter(a => {
    if (filter === 'unread')   return !a.acknowledged;
    if (filter === 'critical') return a.severity === 'critical';
    return true;
  });

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {unreadCount > 0 ? <Bell size={16} className="text-yellow-400" /> : <BellOff size={16} className="text-slate-500" />}
          <span className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Alerts</span>
          {unreadCount > 0 && <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute critical alert sound' : 'Unmute critical alert sound'}
            className={`p-1 rounded transition-colors ${soundEnabled ? 'text-cyan-400 hover:bg-slate-700' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'}`}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>
          <button onClick={clearAll} className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-red-400 transition-colors">
            <Trash2 size={11} /> Clear all
          </button>
        </div>
      </div>
      <div className="text-[11px] text-slate-400 bg-slate-900/50 border border-slate-700/70 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
        <span className="text-red-400 font-semibold">{todayCounts.critical} critical</span>
        <span>,</span>
        <span className="text-yellow-400 font-semibold">
          {todayCounts.warn} {todayCounts.warn === 1 ? 'warning' : 'warnings'}
        </span>
        <span>today</span>
      </div>
      <div className="flex gap-1">
        {['all', 'unread', 'critical'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[11px] px-2.5 py-1 rounded-md capitalize transition-colors ${filter === f ? 'bg-cyan-700 text-cyan-100' : 'text-slate-400 hover:bg-slate-700'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 max-h-80 scrollbar-thin">
        {filtered.length === 0
          ? <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-2"><BellOff size={28} /><span className="text-xs">No alerts</span></div>
          : filtered.map(alert => <AlertRow key={alert.id} alert={alert} onAck={acknowledge} />)
        }
      </div>
    </div>
  );
}
