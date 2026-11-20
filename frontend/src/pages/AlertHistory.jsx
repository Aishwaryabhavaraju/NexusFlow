import React, { useState } from 'react';
import { useAlerts } from '../context/AlertContext';
import { ArrowLeft, Search, Filter } from 'lucide-react';

const SEVERITY_STYLES = {
  critical: 'bg-red-900/30 border-red-700 text-red-300',
  warn:     'bg-yellow-900/20 border-yellow-700 text-yellow-300',
  info:     'bg-blue-900/20 border-blue-700 text-blue-300',
};

export default function AlertHistory({ onBack }) {
  const { alerts } = useAlerts();
  const [search, setSearch]     = useState('');
  const [severity, setSeverity] = useState('all');

  const filtered = alerts.filter(a => {
    const matchSev    = severity === 'all' || a.severity === severity;
    const matchSearch = !search || a.message?.toLowerCase().includes(search.toLowerCase()) || a.sensor?.toLowerCase().includes(search.toLowerCase());
    return matchSev && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-6 flex flex-col gap-5">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors"><ArrowLeft size={20} /></button>
        <h1 className="text-xl font-bold">Alert History</h1>
        <span className="text-xs text-slate-500">({filtered.length} of {alerts.length} alerts)</span>
      </header>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            placeholder="Search alerts…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 items-center">
          <Filter size={14} className="text-slate-400 mr-1" />
          {['all', 'critical', 'warn', 'info'].map(s => (
            <button key={s} onClick={() => setSeverity(s)}
              className={`text-xs px-3 py-1.5 rounded-md capitalize transition-colors ${severity === s ? 'bg-cyan-700 text-cyan-100' : 'text-slate-400 hover:bg-slate-700'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Sensor</th>
              <th className="px-4 py-3 text-left">Severity</th>
              <th className="px-4 py-3 text-left">Message</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length === 0
              ? <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500 text-xs">No alerts match your filters</td></tr>
              : filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-800/60 transition-colors">
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs">{new Date(a.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-200 capitalize">{a.sensor ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${SEVERITY_STYLES[a.severity] ?? SEVERITY_STYLES.info}`}>
                      {(a.severity ?? 'info').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-xs">{a.message}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] ${a.acknowledged ? 'text-green-400' : 'text-yellow-400'}`}>
                      {a.acknowledged ? '✓ ACK' : '● Pending'}
                    </span>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
