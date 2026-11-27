import React, { useMemo } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity, Zap } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';

function computeSensorHealth(value, warn, critical) {
  if (value == null || !warn || !critical) return 100;
  if (value <= warn) {
    // 90% - 100% when under warning
    const ratio = Math.max(0, value / warn);
    return Math.round(100 - ratio * 10);
  }
  if (value <= critical) {
    // 50% - 85% when between warning and critical
    const ratio = (value - warn) / (critical - warn);
    return Math.round(85 - ratio * 35);
  }
  // 15% - 45% when above critical
  const excessRatio = Math.min(1, (value - critical) / (critical * 0.3));
  return Math.max(10, Math.round(45 - excessRatio * 35));
}

export default function SystemHealthScore({ latest, sensors, activeDevice }) {
  const { thresholds, alerts } = useAlerts();

  const healthData = useMemo(() => {
    if (!latest) {
      return {
        score: 95,
        status: 'OPTIMAL',
        color: '#10b981',
        strokeClass: 'text-emerald-400',
        bgClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        description: 'Telemetry nominal, no recent threshold infractions.',
        sensorScores: {},
      };
    }

    const sensorScores = {};
    let totalScore = 0;

    for (const sensor of sensors || ['temperature', 'pressure', 'vibration']) {
      const val = latest[sensor];
      const t = thresholds?.[sensor] || { warn: 80, critical: 100 };
      const score = computeSensorHealth(val, t.warn, t.critical);
      sensorScores[sensor] = score;
      totalScore += score;
    }

    let avgScore = Math.round(totalScore / (sensors?.length || 3));

    // Penalty for active unacknowledged critical alerts in the last 15 mins
    const recentCritical = alerts.filter(
      (a) => !a.acknowledged && a.severity === 'critical'
    ).length;
    avgScore = Math.max(5, avgScore - recentCritical * 5);

    let status = 'OPTIMAL';
    let color = '#10b981';
    let strokeClass = 'text-emerald-400';
    let bgClass = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    let description = 'All sensor telemetry operating within safe design limits.';

    if (avgScore < 50) {
      status = 'CRITICAL';
      color = '#ef4444';
      strokeClass = 'text-rose-500';
      bgClass = 'bg-rose-500/15 border-rose-500/40 text-rose-400 animate-pulse';
      description = 'Critical parameter breach! Rapid thermal or pressure divergence.';
    } else if (avgScore < 75) {
      status = 'WARNING';
      color = '#f59e0b';
      strokeClass = 'text-amber-400';
      bgClass = 'bg-amber-500/15 border-amber-500/40 text-amber-400';
      description = 'Elevated operating strain detected. Nearing warning thresholds.';
    } else if (avgScore < 90) {
      status = 'STABLE';
      color = '#06b6d4';
      strokeClass = 'text-cyan-400';
      bgClass = 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
      description = 'Nominal continuous telemetry with minor stochastic load variance.';
    }

    return {
      score: avgScore,
      status,
      color,
      strokeClass,
      bgClass,
      description,
      sensorScores,
    };
  }, [latest, sensors, thresholds, alerts]);

  // SVG circular gauge math
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthData.score / 100) * circumference;

  return (
    <div className="bg-slate-800/60 border border-slate-700 light-card rounded-xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden">
      {/* Background glow accent */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: healthData.color }}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-700 text-cyan-400">
            <Activity size={15} />
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200 light-text">
              System Health Score
            </h2>
            <p className="text-[10px] text-slate-400 light-muted truncate max-w-[180px]">
              {activeDevice?.name || 'Primary Machinery'}
            </p>
          </div>
        </div>

        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border flex items-center gap-1 ${healthData.bgClass}`}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: healthData.color }} />
          {healthData.status}
        </span>
      </div>

      <div className="flex items-center gap-4 py-1">
        {/* Circular Gauge */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 80 80">
            {/* Background ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              className="text-slate-700/60"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke={healthData.color}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black tracking-tight text-white light-text">
              {healthData.score}
            </span>
            <span className="text-[9px] font-semibold text-slate-400 light-muted">/100</span>
          </div>
        </div>

        {/* Sub-breakdown bars */}
        <div className="flex-1 flex flex-col gap-1.5 text-xs">
          {['temperature', 'pressure', 'vibration'].map((key) => {
            const sc = healthData.sensorScores[key] ?? 95;
            const barColor = sc >= 85 ? 'bg-emerald-500' : sc >= 60 ? 'bg-amber-500' : 'bg-rose-500';
            return (
              <div key={key} className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="capitalize text-slate-300 light-text font-medium">{key}</span>
                  <span className="text-slate-400 font-semibold">{sc}%</span>
                </div>
                <div className="w-full h-1 bg-slate-700/70 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${sc}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[10px] text-slate-400 light-muted leading-tight border-t border-slate-700/50 pt-2 flex items-center gap-1.5">
        <Zap size={11} className="text-cyan-400 shrink-0" />
        <span className="truncate">{healthData.description}</span>
      </p>
    </div>
  );
}
