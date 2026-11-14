import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const SENSOR_CONFIG = {
  temperature: { color: '#f97316', unit: '°C',   domain: [0, 130], warn: 80,  critical: 100 },
  pressure:    { color: '#38bdf8', unit: ' bar',  domain: [0, 11],  warn: 7.5, critical: 9   },
  vibration:   { color: '#a78bfa', unit: ' mm/s', domain: [0, 6],   warn: 3.5, critical: 4.5 },
};
const ALL_SENSORS = Object.keys(SENSOR_CONFIG);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }} className="flex gap-2">
          <span className="font-semibold capitalize">{p.dataKey}:</span>
          <span>{p.value?.toFixed(2)}{SENSOR_CONFIG[p.dataKey]?.unit}</span>
        </div>
      ))}
    </div>
  );
};

export default function LiveChart({ series, sensors = ALL_SENSORS }) {
  const [activeSensors, setActiveSensors] = useState(new Set(sensors));

  const toggle = (sensor) => setActiveSensors((prev) => {
    const next = new Set(prev);
    next.has(sensor) ? next.delete(sensor) : next.add(sensor);
    return next;
  });

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Live Telemetry Stream</h2>
        <div className="flex gap-2 flex-wrap">
          {ALL_SENSORS.map((s) => (
            <button key={s} onClick={() => toggle(s)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-200 ${activeSensors.has(s) ? 'text-white' : 'border-slate-600 text-slate-500'}`}
              style={activeSensors.has(s) ? { backgroundColor: SENSOR_CONFIG[s].color + '33', borderColor: SENSOR_CONFIG[s].color, color: SENSOR_CONFIG[s].color } : {}}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={series} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="timestamp" tick={{ fill: '#94a3b8', fontSize: 10 }} interval="preserveStartEnd" tickLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          {ALL_SENSORS.filter(s => activeSensors.has(s)).flatMap(s => [
            <ReferenceLine key={`${s}-w`} y={SENSOR_CONFIG[s].warn}     stroke={SENSOR_CONFIG[s].color} strokeDasharray="4 4" strokeOpacity={0.4} />,
            <ReferenceLine key={`${s}-c`} y={SENSOR_CONFIG[s].critical} stroke="#ef4444"                strokeDasharray="4 2" strokeOpacity={0.6} />,
          ])}
          {ALL_SENSORS.filter(s => activeSensors.has(s)).map(s => (
            <Line key={s} type="monotone" dataKey={s} stroke={SENSOR_CONFIG[s].color} dot={false} strokeWidth={2} isAnimationActive={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-slate-500 text-right">Dashed lines: warning / critical thresholds · Last {series.length} points</p>
    </div>
  );
}
