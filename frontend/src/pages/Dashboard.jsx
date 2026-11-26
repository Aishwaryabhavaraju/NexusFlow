import React, { useEffect, useRef } from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import LiveChart from '../components/dashboard/LiveChart';
import AlertPanel from '../components/dashboard/AlertPanel';
import ConnectionStatus from '../components/dashboard/ConnectionStatus';
import AlertBreakdownChart from '../components/dashboard/AlertBreakdownChart';
import SensorBarChart from '../components/dashboard/SensorBarChart';
import GlowingPipeline from '../components/dashboard/GlowingPipeline';
import DataFlowIndicator from '../components/dashboard/DataFlowIndicator';
import { useTelemetry } from '../hooks/useTelemetry';
import { useTelemetryContext } from '../context/TelemetryContext';
import { useAlerts } from '../context/AlertContext';
import { useTheme } from '../context/ThemeContext';

const THRESHOLDS = {
  temperature: { warn: 80,  critical: 100 },
  pressure:    { warn: 7.5, critical: 9   },
  vibration:   { warn: 3.5, critical: 4.5 },
};

export default function Dashboard() {
  const { wsStatus, latestPayload } = useTelemetryContext();
  const { series, latest, sensors }  = useTelemetry(latestPayload);
  const { addAlert }                  = useAlerts();
  const { isDark }                    = useTheme();
  const prevRef = useRef({});

  // Alert threshold detection
  useEffect(() => {
    if (!latest) return;
    sensors.forEach((sensor) => {
      const value     = latest[sensor];
      const prevValue = prevRef.current[sensor] ?? value;
      const t         = THRESHOLDS[sensor];
      if (!t) return;
      if (value >= t.critical && prevValue < t.critical)
        addAlert({ sensor, value, threshold: t.critical, severity: 'critical',
          message: `🚨 ${sensor} reached CRITICAL: ${value.toFixed(2)}` });
      else if (value >= t.warn && prevValue < t.warn)
        addAlert({ sensor, value, threshold: t.warn, severity: 'warn',
          message: `⚠️ ${sensor} crossed warning threshold: ${value.toFixed(2)}` });
    });
    prevRef.current = { ...latest };
  }, [latest, sensors, addAlert]);

  const prevLatest  = series[series.length - 2] ?? latest;
  const baseText    = isDark ? 'text-slate-200' : 'text-slate-800';
  const mutedText   = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 w-full">

      {/* ── Page header ── */}
      <header className="hidden lg:flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${baseText}`}>Real-Time Dashboard</h1>
          <p className={`text-xs ${mutedText}`}>IoT Telemetry & Alerting — Member 4 (Sowmya)</p>
        </div>
        <ConnectionStatus status={wsStatus} />
      </header>

      {/* Mobile header spacer (sidebar is a top bar on mobile) */}
      <div className="lg:hidden h-10" />

      {/* ── Glowing Pipeline + Data Flow row ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlowingPipeline dataTimestamp={latest?.timestamp} wsStatus={wsStatus} />
        <DataFlowIndicator latest={latest} sensors={sensors} />
      </section>

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

      {/* ── Stats Bar Chart + Alert Pie ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SensorBarChart series={series} sensors={sensors} />
        </div>
        <div>
          <AlertBreakdownChart />
        </div>
      </section>

      <footer className={`text-center text-[10px] ${mutedText} pb-2`}>
        NexusFlow · Member 4 — Real-Time Dashboard & Alerting (Sowmya) · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
