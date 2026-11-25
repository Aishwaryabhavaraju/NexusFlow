import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';

const UNIT_MAP = { temperature: '°C', pressure: 'bar', vibration: 'mm/s' };

function getSeverity(sensor, value, thresholds) {
  const t = thresholds?.[sensor];
  if (!t) return 'normal';
  if (value >= t.critical) return 'critical';
  if (value >= t.warn)     return 'warn';
  return 'normal';
}

const SEVERITY_STYLES = {
  normal:   'border-slate-700 bg-slate-800/60',
  warn:     'border-yellow-600 bg-yellow-900/20',
  critical: 'border-red-500 bg-red-900/20 shadow-lg animate-pulse',
};
const VALUE_STYLES = { normal: 'text-white', warn: 'text-yellow-300', critical: 'text-red-400' };

export default function MetricCard({ sensor, value, prevValue }) {
  const { thresholds } = useAlerts();
  const unit     = UNIT_MAP[sensor] ?? '';
  const severity = getSeverity(sensor, value, thresholds);
  const delta    = value - (prevValue ?? value);
  const TrendIcon = delta > 0.05 ? TrendingUp : delta < -0.05 ? TrendingDown : Minus;
  const trendColor = delta > 0.05 ? 'text-red-400' : delta < -0.05 ? 'text-green-400' : 'text-gray-500';
  const criticalMax = thresholds?.[sensor]?.critical;

  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-2 transition-all duration-500 ${SEVERITY_STYLES[severity]}`}>
      <div className="flex justify-between items-center">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">{sensor}</span>
        {severity !== 'normal' && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${severity === 'critical' ? 'bg-red-700 text-red-100' : 'bg-yellow-700 text-yellow-100'}`}>
            {severity.toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-bold tabular-nums ${VALUE_STYLES[severity]}`}>
          {value?.toFixed(sensor === 'pressure' ? 2 : 1)}
        </span>
        <span className="text-slate-400 text-sm mb-1">{unit}</span>
      </div>
      <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
        <TrendIcon size={12} />{Math.abs(delta).toFixed(2)} {unit} from last
      </div>
      <div className="mt-1">
        <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${severity === 'critical' ? 'bg-red-500' : severity === 'warn' ? 'bg-yellow-500' : 'bg-cyan-500'}`}
            style={{ width: `${Math.min(100, (value / (criticalMax ?? value * 1.2)) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
          <span>0</span><span>{criticalMax ?? '—'}{unit} max</span>
        </div>
      </div>
    </div>
  );
}
