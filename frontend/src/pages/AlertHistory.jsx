import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  RotateCcw,
  Cpu,
  FileSpreadsheet,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAlerts } from '../context/AlertContext';
import { useTheme } from '../context/ThemeContext';
import { MOCK_DEVICES } from '../constants/devices';

const SEVERITY_STYLES = {
  critical: 'bg-rose-900/30 border-rose-700 text-rose-300',
  warn:     'bg-amber-900/20 border-amber-700 text-amber-300',
  info:     'bg-blue-900/20 border-blue-700 text-blue-300',
};

const TIME_PRESETS = [
  { id: 'all',    label: 'All Time' },
  { id: '15m',    label: 'Last 15m' },
  { id: '1h',     label: 'Last 1h' },
  { id: '24h',    label: 'Last 24h' },
  { id: 'today',  label: 'Today' },
  { id: 'custom', label: 'Custom Range' },
];

export default function AlertHistory({ onBack }) {
  const { alerts, todayCounts } = useAlerts();
  const { isDark } = useTheme();

  const [search, setSearch]             = useState('');
  const [severity, setSeverity]         = useState('all');
  const [timePreset, setTimePreset]     = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [startDate, setStartDate]       = useState('');
  const [endDate, setEndDate]           = useState('');

  // Filter alerts by search, severity, device, and date/time
  const filtered = useMemo(() => {
    const now = Date.now();

    return alerts.filter((a) => {
      // 1. Severity filter
      if (severity !== 'all' && a.severity !== severity) return false;

      // 2. Device filter
      if (deviceFilter !== 'all' && a.deviceId && a.deviceId !== deviceFilter) return false;

      // 3. Search filter
      if (search) {
        const q = search.toLowerCase();
        const msg = (a.message || '').toLowerCase();
        const sensor = (a.sensor || '').toLowerCase();
        const devName = (a.deviceName || '').toLowerCase();
        if (!msg.includes(q) && !sensor.includes(q) && !devName.includes(q)) {
          return false;
        }
      }

      // 4. Time range filter
      const alertTime = new Date(a.timestamp).getTime();

      if (timePreset === '15m') {
        if (now - alertTime > 15 * 60 * 1000) return false;
      } else if (timePreset === '1h') {
        if (now - alertTime > 60 * 60 * 1000) return false;
      } else if (timePreset === '24h') {
        if (now - alertTime > 24 * 60 * 60 * 1000) return false;
      } else if (timePreset === 'today') {
        const d = new Date(alertTime);
        const today = new Date();
        const isSameDay =
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate();
        if (!isSameDay) return false;
      } else if (timePreset === 'custom') {
        if (startDate) {
          const sTime = new Date(startDate).getTime();
          if (alertTime < sTime) return false;
        }
        if (endDate) {
          const eTime = new Date(endDate).getTime();
          if (alertTime > eTime) return false;
        }
      }

      return true;
    });
  }, [alerts, search, severity, deviceFilter, timePreset, startDate, endDate]);

  // Export alerts as CSV
  const handleExportCSV = () => {
    if (!filtered || filtered.length === 0) {
      toast.error('No alerts available to export with current filters.');
      return;
    }

    try {
      const headers = [
        'Alert ID',
        'ISO Timestamp',
        'Formatted Date',
        'Formatted Time',
        'Device ID',
        'Device Name',
        'Sensor',
        'Severity',
        'Value',
        'Threshold',
        'Status',
        'Message',
      ];

      const escapeCSV = (val) => {
        if (val == null) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rows = filtered.map((a) => {
        const dateObj = new Date(a.timestamp);
        return [
          escapeCSV(a.id),
          escapeCSV(a.timestamp),
          escapeCSV(dateObj.toLocaleDateString()),
          escapeCSV(dateObj.toLocaleTimeString()),
          escapeCSV(a.deviceId || 'turbine-01'),
          escapeCSV(a.deviceName || 'Primary Machinery'),
          escapeCSV(a.sensor || 'System'),
          escapeCSV(a.severity || 'info'),
          escapeCSV(a.value != null ? Number(a.value).toFixed(2) : ''),
          escapeCSV(a.threshold != null ? Number(a.threshold).toFixed(2) : ''),
          escapeCSV(a.acknowledged ? 'ACKNOWLEDGED' : 'PENDING'),
          escapeCSV(a.message || ''),
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const timestampStr = new Date().toISOString().replace(/[:.]/g, '-');
      link.setAttribute('href', url);
      link.setAttribute('download', `nexusflow_alerts_${timestampStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${filtered.length} alert records to CSV!`, {
        icon: '📊',
      });
    } catch (err) {
      toast.error('Failed to export alerts to CSV.');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSeverity('all');
    setTimePreset('all');
    setDeviceFilter('all');
    setStartDate('');
    setEndDate('');
    toast('Filters reset to default.', { icon: '🔄' });
  };

  const isCustomTime = timePreset === 'custom';
  const hasActiveFilters =
    search || severity !== 'all' || timePreset !== 'all' || deviceFilter !== 'all' || startDate || endDate;

  return (
    <div className="min-h-screen bg-slate-900 text-white light-bg p-4 md:p-6 flex flex-col gap-5">
      {/* ── Top Header ── */}
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
            title="Return to Dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white light-text flex items-center gap-2">
              Alert History
            </h1>
            <p className="text-xs text-slate-400 light-muted">
              Auditing, date range analysis & CSV download ({filtered.length} of {alerts.length} matches)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs bg-slate-800/80 border border-slate-700 rounded-full px-3 py-1.5 light-card">
            <span className="text-red-400 font-semibold">{todayCounts.critical} critical</span>
            <span className="text-slate-500">·</span>
            <span className="text-yellow-400 font-semibold">{todayCounts.warn} warnings today</span>
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV ({filtered.length})</span>
          </button>
        </div>
      </header>

      {/* ── Filter Controls Container ── */}
      <div className="bg-slate-800/60 border border-slate-700 light-card rounded-xl p-4 flex flex-col gap-3">
        {/* Row 1: Search + Device Selector + Reset */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 light-text placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              placeholder="Search by keyword, sensor name, device, message…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Device Filter */}
          <div className="flex items-center gap-1.5">
            <Cpu size={14} className="text-slate-400 ml-1" />
            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="bg-slate-900/80 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 light-text focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Monitored Devices</option>
              {MOCK_DEVICES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.tag})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Row 2: Severity Tabs + Time Preset Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-700/50">
          {/* Severity filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Filter size={11} /> Severity:
            </span>
            {['all', 'critical', 'warn', 'info'].map((s) => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                className={`text-[11px] px-2.5 py-1 rounded-md capitalize transition-colors ${
                  severity === s
                    ? 'bg-cyan-700 text-cyan-100 font-semibold'
                    : 'text-slate-400 hover:bg-slate-700/60'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Time Preset filter */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Clock size={11} /> Range:
            </span>
            {TIME_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setTimePreset(p.id)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                  timePreset === p.id
                    ? 'bg-cyan-700 text-cyan-100 font-semibold'
                    : 'text-slate-400 hover:bg-slate-700/60'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Custom Date/Time Inputs (only if "custom" is selected) */}
        {isCustomTime && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-700/60 bg-slate-900/40 p-2.5 rounded-lg">
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
              <Calendar size={13} className="text-cyan-400" />
              Custom Range:
            </span>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>From:</span>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>To:</span>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Clear custom dates
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Table Container ── */}
      <div className="overflow-x-auto rounded-xl border border-slate-700 light-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/80 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Timestamp</th>
              <th className="px-4 py-3 text-left">Device</th>
              <th className="px-4 py-3 text-left">Sensor</th>
              <th className="px-4 py-3 text-left">Severity</th>
              <th className="px-4 py-3 text-left">Reading / Threshold</th>
              <th className="px-4 py-3 text-left">Message</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-xs">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileSpreadsheet size={32} className="text-slate-600" />
                    <p className="font-medium text-slate-400">No alerts match your filter criteria.</p>
                    <p className="text-[11px] text-slate-500">
                      Try widening your date/time range or resetting search keywords.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((a) => {
                const dateObj = new Date(a.timestamp);
                return (
                  <tr key={a.id} className="hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs">
                      <div>{dateObj.toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-500">{dateObj.toLocaleTimeString()}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-200 text-xs font-medium">
                      <span className="truncate block max-w-[140px]" title={a.deviceName}>
                        {a.deviceName || 'Turbine #1'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-200 capitalize font-medium text-xs">
                      {a.sensor ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          SEVERITY_STYLES[a.severity] ?? SEVERITY_STYLES.info
                        }`}
                      >
                        {(a.severity ?? 'info').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300 tabular-nums">
                      {a.value != null ? (
                        <span>
                          <strong className="text-white">{Number(a.value).toFixed(2)}</strong>
                          {a.threshold != null && (
                            <span className="text-slate-500 ml-1">/ {Number(a.threshold).toFixed(1)}</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs max-w-xs">{a.message}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-semibold ${
                          a.acknowledged ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {a.acknowledged ? '✓ Acknowledged' : '● Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
