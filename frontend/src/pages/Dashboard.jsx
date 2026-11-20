import React, { useEffect, useRef } from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import LiveChart from '../components/dashboard/LiveChart';
import AlertPanel from '../components/dashboard/AlertPanel';
import ConnectionStatus from '../components/dashboard/ConnectionStatus';
import AlertBreakdownChart from '../components/dashboard/AlertBreakdownChart';
import SensorBarChart from '../components/dashboard/SensorBarChart';
import { useTelemetry } from '../hooks/useTelemetry';
import { useTelemetryContext } from '../context/TelemetryContext';
import { useAlerts } from '../context/AlertContext';
import { Activity } from 'lucide-react';

const THRESHOLDS = {
  temperature: { warn: 80,  critical: 100 },
  pressure:    { warn: 7.5, critical: 9   },
  vibration:   { warn: 3.5, critical: 4.5 },
};

export default function Dashboard({ onViewHistory }) {
  const { wsStatus, latestPayload } = useTelemetryContext();
  const { series, latest, sensors }  = useTelemetry(latestPayload);
  const { addAlert }                  = useAlerts();
  const prevRef = useRef({});

  useEffect(() => {
    if (!latest) return;
    sensors.forEach((sensor) => {
      const value     = latest[sensor];
      const prevValue = prevRef.current[sensor] ?? value;
      const t         = THRESHOLDS[sensor];
      if (!t) return;
      if (value >= t.critical && prevValue < t.critical)
        addAlert({ sensor, value, threshold: t.critical, severity: 'critical', message: `🚨 ${sensor} reached CRITICAL: ${value.toFixed(2)}` });
      else if (value >= t.warn && prevValue < t.warn)
        addAlert({ sensor, value, threshold: t.warn, severity: 'warn', message: `⚠️ ${sensor} crossed warning threshold: ${value.toFixed(2)}` });
    });
    prevRef.current = { ...latest };
  }, [latest, sensors, addAlert]);

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
        <ConnectionStatus status={wsStatus} />
      </header>

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
