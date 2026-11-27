import React, { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal, Activity } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import LiveChart from '../components/dashboard/LiveChart';
import AlertPanel from '../components/dashboard/AlertPanel';
import ConnectionStatus from '../components/dashboard/ConnectionStatus';
import AlertBreakdownChart from '../components/dashboard/AlertBreakdownChart';
import SensorBarChart from '../components/dashboard/SensorBarChart';
import GlowingPipeline from '../components/dashboard/GlowingPipeline';
import DataFlowIndicator from '../components/dashboard/DataFlowIndicator';
import DeviceSelector from '../components/dashboard/DeviceSelector';
import SystemHealthScore from '../components/dashboard/SystemHealthScore';
import ThresholdEditorModal from '../components/dashboard/ThresholdEditorModal';
import { useTelemetry } from '../hooks/useTelemetry';
import { useTelemetryContext } from '../context/TelemetryContext';
import { useAlerts } from '../context/AlertContext';
import { useDevice } from '../context/DeviceContext';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard({ onViewHistory }) {
  const { wsStatus, latestPayload } = useTelemetryContext();
  const { selectedDevice } = useDevice();
  const { series, latest, sensors } = useTelemetry(latestPayload, selectedDevice);
  const { thresholds, addAlert } = useAlerts();
  const { isDark } = useTheme();

  const [thresholdsOpen, setThresholdsOpen] = useState(false);
  const prevRef = useRef({});

  // Dynamic alert threshold detection respecting active device and user-configured limits
  useEffect(() => {
    if (!latest) return;
    sensors.forEach((sensor) => {
      const value = latest[sensor];
      const prevValue = prevRef.current[sensor] ?? value;
      const t = thresholds?.[sensor] || { warn: 80, critical: 100 };
      if (!t) return;

      if (value >= t.critical && prevValue < t.critical) {
        addAlert({
          sensor,
          value,
          threshold: t.critical,
          severity: 'critical',
          deviceId: selectedDevice.id,
          deviceName: selectedDevice.name,
          message: `🚨 ${selectedDevice.shortName}: ${sensor} reached CRITICAL level: ${value.toFixed(2)}`,
        });
      } else if (value >= t.warn && prevValue < t.warn) {
        addAlert({
          sensor,
          value,
          threshold: t.warn,
          severity: 'warn',
          deviceId: selectedDevice.id,
          deviceName: selectedDevice.name,
          message: `⚠️ ${selectedDevice.shortName}: ${sensor} crossed warning threshold: ${value.toFixed(2)}`,
        });
      }
    });
    prevRef.current = { ...latest };
  }, [latest, sensors, thresholds, selectedDevice, addAlert]);

  const prevLatest = series[series.length - 2] ?? latest;
  const baseText = isDark ? 'text-slate-200' : 'text-slate-800';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 w-full">
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${baseText} flex items-center gap-2`}>
            NexusFlow Dashboard
          </h1>
          <p className={`text-xs ${mutedText}`}>
            Real-Time IoT Telemetry & Dynamic Rule Engine — Member 4 (Sowmya)
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Mock Device Selector */}
          <DeviceSelector />

          {/* Thresholds Config Button */}
          <button
            type="button"
            onClick={() => setThresholdsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors light-card"
            title="Configure warning & critical thresholds"
          >
            <SlidersHorizontal size={13} className="text-cyan-400" />
            <span className="hidden sm:inline">Thresholds</span>
          </button>

          {/* Connection Status */}
          <ConnectionStatus status={wsStatus} />
        </div>
      </header>

      {/* ── Top Row: System Health + Glowing Pipeline + Data Flow ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SystemHealthScore
          latest={latest}
          sensors={sensors}
          activeDevice={selectedDevice}
        />
        <GlowingPipeline
          dataTimestamp={latest?.timestamp}
          wsStatus={wsStatus}
          activeDevice={selectedDevice}
        />
        <DataFlowIndicator
          latest={latest}
          sensors={sensors}
        />
      </section>

      {/* ── KPI Sensor Cards ── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sensors.map((s) => (
          <MetricCard
            key={s}
            sensor={s}
            value={latest?.[s] ?? 0}
            prevValue={prevLatest?.[s] ?? 0}
          />
        ))}
      </section>

      {/* ── Live Chart + Alert Panel ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LiveChart series={series} sensors={sensors} />
        </div>
        <div>
          <AlertPanel onOpenThresholds={() => setThresholdsOpen(true)} />
        </div>
      </section>

      {/* ── Stats Bar Chart + Alert Breakdown Donut ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SensorBarChart series={series} sensors={sensors} />
        </div>
        <div>
          <AlertBreakdownChart />
        </div>
      </section>

      <footer className={`text-center text-[10px] ${mutedText} pb-2 flex items-center justify-center gap-3`}>
        <span>NexusFlow · Member 4 — Real-Time Dashboard & Alerting (Sowmya) · {new Date().getFullYear()}</span>
        {onViewHistory && (
          <button onClick={onViewHistory} className="underline hover:text-cyan-400 transition-colors">
            View Complete Alert History →
          </button>
        )}
      </footer>

      {/* Threshold Editor Modal */}
      <ThresholdEditorModal
        open={thresholdsOpen}
        onClose={() => setThresholdsOpen(false)}
      />
    </div>
  );
}
