import React, { useState } from 'react';
import {
  Bell,
  BellOff,
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAlerts } from '../../context/AlertContext';

const SEVERITY_STYLES = {
  critical: 'border-l-rose-500 bg-rose-950/30',
  warn:     'border-l-amber-500 bg-amber-950/20',
  info:     'border-l-blue-500 bg-blue-950/20',
};

const BADGE_STYLES = {
  critical: 'bg-rose-700 text-rose-100',
  warn:     'bg-amber-700 text-amber-100',
  info:     'bg-blue-700 text-blue-100',
};

function AlertRow({ alert, onAck }) {
  const [expanded, setExpanded] = useState(false);
  const style = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.info;
  const badge = BADGE_STYLES[alert.severity]    ?? BADGE_STYLES.info;

  return (
    <div className={`border-l-4 rounded-r-lg p-2.5 transition-opacity duration-300 ${style} ${alert.acknowledged ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${badge}`}>
              {(alert.severity ?? 'INFO').toUpperCase()}
            </span>
            <span className="text-xs font-semibold text-slate-200 light-text capitalize truncate">
              {alert.sensor ?? 'System'}
            </span>
            {alert.deviceName && (
              <span className="text-[9px] text-cyan-400 bg-cyan-950/40 px-1 rounded border border-cyan-800/40 truncate max-w-[90px]">
                {alert.deviceName}
              </span>
            )}
            <span className="text-[10px] text-slate-500">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <p className="text-xs text-slate-300 light-text mt-1">{alert.message}</p>

          {expanded && alert.value != null && (
            <p className="text-[10px] text-slate-400 mt-1 bg-slate-900/40 p-1.5 rounded">
              Current Reading: <strong className="text-slate-200">{Number(alert.value).toFixed(2)}</strong>
              {alert.threshold != null && (
                <> · Configured Limit: <strong className="text-slate-200">{Number(alert.threshold).toFixed(2)}</strong></>
              )}
            </p>
          )}
        </div>

        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1 rounded hover:bg-slate-700 text-slate-400"
            title="Toggle Details"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {!alert.acknowledged && (
            <button
              onClick={() => onAck(alert.id)}
              className="p-1 rounded hover:bg-emerald-800 text-emerald-400"
              title="Acknowledge Alert"
            >
              <Check size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AlertPanel({ onOpenThresholds }) {
  const { alerts, unreadCount, todayCounts, soundEnabled, toggleSound, acknowledge, clearAll } = useAlerts();
  const [filter, setFilter] = useState('all');

  const filtered = alerts.filter((a) => {
    if (filter === 'unread')   return !a.acknowledged;
    if (filter === 'critical') return a.severity === 'critical';
    return true;
  });

  const handleExportCSV = () => {
    if (!alerts.length) {
      toast.error('No alerts recorded yet to export.');
      return;
    }
    const headers = ['ID', 'Timestamp', 'Device', 'Sensor', 'Severity', 'Value', 'Threshold', 'Status', 'Message'];
    const escapeCSV = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = alerts.map((a) => [
      escapeCSV(a.id),
      escapeCSV(new Date(a.timestamp).toISOString()),
      escapeCSV(a.deviceName || 'Turbine #1'),
      escapeCSV(a.sensor || ''),
      escapeCSV(a.severity || ''),
      escapeCSV(a.value != null ? Number(a.value).toFixed(2) : ''),
      escapeCSV(a.threshold != null ? Number(a.threshold).toFixed(2) : ''),
      escapeCSV(a.acknowledged ? 'ACK' : 'PENDING'),
      escapeCSV(a.message || ''),
    ].join(','));

    const blob = new Blob([[headers.join(','), ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexusflow_quick_alerts_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${alerts.length} alerts!`, { icon: '📊' });
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700 light-card rounded-xl p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {unreadCount > 0 ? (
            <Bell size={16} className="text-amber-400 animate-pulse" />
          ) : (
            <BellOff size={16} className="text-slate-500" />
          )}
          <span className="text-sm font-semibold text-slate-200 light-text uppercase tracking-wider">
            Alert Feed
          </span>
          {unreadCount > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenThresholds && (
            <button
              onClick={onOpenThresholds}
              title="Configure Alert Thresholds"
              className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
            >
              <SlidersHorizontal size={13} />
            </button>
          )}

          <button
            onClick={handleExportCSV}
            title="Quick Download CSV"
            className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
          >
            <Download size={13} />
          </button>

          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute critical alert audio' : 'Unmute critical alert audio'}
            className={`p-1 rounded transition-colors ${
              soundEnabled ? 'text-cyan-400 hover:bg-slate-700' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'
            }`}
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>

          <button
            onClick={clearAll}
            title="Clear all alerts"
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-rose-400 transition-colors ml-1"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 light-muted bg-slate-900/50 border border-slate-700/70 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-rose-400 font-semibold">{todayCounts.critical} critical</span>
          <span>·</span>
          <span className="text-amber-400 font-semibold">{todayCounts.warn} warnings today</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">{alerts.length} logged</span>
      </div>

      <div className="flex gap-1">
        {['all', 'unread', 'critical'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[11px] px-2.5 py-1 rounded-md capitalize transition-colors ${
              filter === f ? 'bg-cyan-700 text-cyan-100 font-semibold' : 'text-slate-400 hover:bg-slate-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 max-h-80 scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-500 gap-2">
            <BellOff size={28} />
            <span className="text-xs">No active alerts</span>
          </div>
        ) : (
          filtered.map((alert) => <AlertRow key={alert.id} alert={alert} onAck={acknowledge} />)
        )}
      </div>
    </div>
  );
}
