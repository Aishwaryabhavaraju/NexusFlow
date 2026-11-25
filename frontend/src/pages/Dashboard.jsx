import React, { useEffect, useRef, useState } from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import LiveChart from '../components/dashboard/LiveChart';
import AlertPanel from '../components/dashboard/AlertPanel';
import ConnectionStatus from '../components/dashboard/ConnectionStatus';
import AlertBreakdownChart from '../components/dashboard/AlertBreakdownChart';
import SensorBarChart from '../components/dashboard/SensorBarChart';
import ThresholdEditorModal from '../components/dashboard/ThresholdEditorModal';
import { useTelemetry } from '../hooks/useTelemetry';
import { useTelemetryContext } from '../context/TelemetryContext';
import { useAlerts } from '../context/AlertContext';
import { Activity, SlidersHorizontal, Volume2, VolumeX } from 'lucide-react';

export default function Dashboard({ onViewHistory }) {
  const { wsStatus, latestPayload } = useTelemetryContext();
  const { series, latest, sensors }  = useTelemetry(latestPayload);
  const { addAlert, thresholds, todayCounts, soundEnabled, toggleSound } = useAlerts();
  const [thresholdsOpen, setThresholdsOpen] = useState(false);
  const prevRef = useRef({});

  useEffect(() => {
    if (!latest) return;
    sensors.forEach((sensor) => {
      const value     = latest[sensor];
      const prevValue = prevRef.current[sensor] ?? value;
      const t         = thresholds[sensor];
      if (!t) return;
      if (value >= t.critical && prevValue < t.critical)
        addAlert({ sensor, value, threshold: t.critical, severity: 'critical', message: `🚨 ${sensor} reached CRITICAL: ${value.toFixed(2)}` });
      else if (value >= t.warn && prevValue < t.warn)
        addAlert({ sensor, value, threshold: t.warn, severity: 'warn', message: `⚠️ ${sensor} crossed warning threshold: ${value.toFixed(2)}` });
    });
    prevRef.current = { ...latest };
  }, [latest, sensors, thresholds, addAlert]);

  const prevLatest = series[series.length - 2] ?? latest;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-6 flex flex-col gap-6">

      {/* ── Top bar ── */}
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/20 p-2 rounded-lg border border-cyan-500/30">
            <Activity size={20} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">NexusFlow Dashboard</h1>
            <p className="text-xs text-slate-400">Real-Time IoT Telemetry & Alerting</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs bg-slate-800/80 border border-slate-700 rounded-full px-3 py-1">
            <span className="text-red-400 font-semibold">{todayCounts.critical} critical</span>
            <span className="text-slate-500">,</span>
            <span className="text-yellow-400 font-semibold">
              {todayCounts.warn} {todayCounts.warn === 1 ? 'warning' : 'warnings'}
            </span>
            <span className="text-slate-400">today</span>
          </div>
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute critical alert sound' : 'Enable critical alert sound'}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-slate-800/80 border-slate-700 text-cyan-300 hover:bg-slate-700'
                : 'bg-slate-800/50 border-slate-700/60 text-slate-500 hover:text-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>
          <button
            onClick={() => setThresholdsOpen(true)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-cyan-500/50 transition-colors"
          >
            <SlidersHorizontal size={14} className="text-cyan-400" />
            <span>Thresholds</span>
          </button>
          <ConnectionStatus status={wsStatus} />
        </div>
      </header>

      <ThresholdEditorModal open={thresholdsOpen} onClose={() => setThresholdsOpen(false)} />

      {/* ── KPI Cards ── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sensors.map(s => (
          <MetricCard key={s} sensor={s} value={latest?.[s] ?? 0} prevValue={prevLatest?.[s] ?? 0} />
        ))}
      </section>

      {/* ── Live Chart + Alert Panel ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LiveChart series={series} sensors={sensors} />
        </div>
        <div>
          <AlertPanel />
        </div>
      </section>

      {/* ── NEW: Bar Chart + Pie Chart ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SensorBarChart series={series} sensors={sensors} />
        </div>
        <div>
          <AlertBreakdownChart />
        </div>
      </section>

      <footer className="text-center text-[10px] text-slate-600 flex items-center justify-center gap-3">
        <span>NexusFlow · Member 4 — Real-Time Dashboard & Alerting (Sowmya) · {new Date().getFullYear()}</span>
        {onViewHistory && (
          <button onClick={onViewHistory} className="underline hover:text-slate-400 transition-colors">
            View Alert History →
          </button>
        )}
      </footer>
    </div>
  );
}
