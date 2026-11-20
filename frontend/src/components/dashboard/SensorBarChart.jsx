import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const SENSOR_COLORS = {
  temperature: '#f97316',
  pressure:    '#38bdf8',
  vibration:   '#a78bfa',
};

const UNIT_MAP = {
  temperature: '°C',
  pressure:    'bar',
  vibration:   'mm/s',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-slate-300 mb-1 font-semibold">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex justify-between gap-4" style={{ color: p.color }}>
          <span className="capitalize">{p.dataKey}:</span>
          <span className="font-bold">{p.value?.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
};

export default function SensorBarChart({ series, sensors }) {
  const data = useMemo(() => {
    return sensors.map(sensor => {
      const vals = series.map(p => p[sensor]).filter(v => v != null);
      if (!vals.length) return { sensor, min: 0, avg: 0, max: 0 };
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      return {
        sensor: sensor.charAt(0).toUpperCase() + sensor.slice(1),
        min:  +min.toFixed(2),
        avg:  +avg.toFixed(2),
        max:  +max.toFixed(2),
        unit: UNIT_MAP[sensor] ?? '',
        color: SENSOR_COLORS[sensor],
      };
    });
  }, [series, sensors]);

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Sensor Statistics</h2>
        <span className="text-xs text-slate-400">Min / Avg / Max · last {series.length}s</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barCategoryGap="30%">
          <defs>
            <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="sensor" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend
            formatter={v => <span style={{ fontSize: 11, color: '#cbd5e1', textTransform: 'capitalize' }}>{v}</span>}
            iconType="square" iconSize={8}
          />
          <Bar dataKey="min" fill="#334155" radius={[4,4,0,0]} />
          <Bar dataKey="avg" fill="url(#avgGrad)" radius={[4,4,0,0]} />
          <Bar dataKey="max" fill="#ef4444" opacity={0.65} radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-2">
        {data.map(d => (
          <div key={d.sensor} className="flex items-center gap-2 bg-slate-900/60 rounded-lg px-3 py-1.5 text-xs border border-slate-700">
            <span className="font-semibold" style={{ color: d.color }}>{d.sensor}</span>
            <span className="text-slate-500">avg</span>
            <span className="text-white font-bold">{d.avg}{d.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
