import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Brush
} from 'recharts';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';

const SENSOR_CONFIG = {
  temperature: { color: '#f97316', unit: '°C' },
  pressure:    { color: '#38bdf8', unit: ' bar' },
  vibration:   { color: '#a78bfa', unit: ' mm/s' },
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
  const { thresholds } = useAlerts();
  const [activeSensors, setActiveSensors] = useState(new Set(sensors));
  const [brushRange, setBrushRange] = useState(null); // { startIndex, endIndex }
  const [zoomLevel, setZoomLevel]   = useState(60);   // how many points to show in brush window

  const toggle = (sensor) => setActiveSensors((prev) => {
    const next = new Set(prev);
    if (next.has(sensor)) next.delete(sensor);
    else next.add(sensor);
    return next;
  });

  const handleZoomIn = () => {
    setZoomLevel(v => Math.max(10, v - 10));
    setBrushRange(null);
  };
  const handleZoomOut = () => {
    setZoomLevel(v => Math.min(series.length, v + 10));
    setBrushRange(null);
  };
  const handleReset = () => {
    setZoomLevel(60);
    setBrushRange(null);
  };

  // Default brush shows the last `zoomLevel` points
  const defaultStart = Math.max(0, series.length - zoomLevel);
  const startIndex = brushRange?.startIndex ?? defaultStart;
  const endIndex   = brushRange?.endIndex   ?? series.length - 1;

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
      {/* header row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          Live Telemetry Stream
        </h2>

        <div className="flex items-center gap-3 flex-wrap">
          {/* sensor toggles */}
          <div className="flex gap-2 flex-wrap">
            {ALL_SENSORS.map((s) => (
              <button key={s} onClick={() => toggle(s)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-200 ${activeSensors.has(s) ? 'text-white' : 'border-slate-600 text-slate-500'}`}
                style={activeSensors.has(s)
                  ? { backgroundColor: SENSOR_CONFIG[s].color + '33', borderColor: SENSOR_CONFIG[s].color, color: SENSOR_CONFIG[s].color }
                  : {}}>
                {s}
              </button>
            ))}
          </div>

          {/* zoom controls */}
          <div className="flex items-center gap-1 border border-slate-700 rounded-lg p-0.5">
            <button onClick={handleZoomIn}  title="Zoom in"  className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"><ZoomIn  size={13} /></button>
            <button onClick={handleZoomOut} title="Zoom out" className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"><ZoomOut size={13} /></button>
            <button onClick={handleReset}   title="Reset"    className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"><Maximize2 size={13} /></button>
          </div>
        </div>
      </div>

      {/* main chart */}
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={series} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="timestamp"
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            interval="preserveStartEnd"
            tickLine={false}
            domain={[startIndex, endIndex]}
          />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />

          {/* threshold reference lines */}
          {ALL_SENSORS.filter(s => activeSensors.has(s) && thresholds?.[s]).flatMap(s => [
            <ReferenceLine key={`${s}-w`} y={thresholds[s].warn}     stroke={SENSOR_CONFIG[s].color} strokeDasharray="4 4" strokeOpacity={0.4} />,
            <ReferenceLine key={`${s}-c`} y={thresholds[s].critical} stroke="#ef4444"                strokeDasharray="4 2" strokeOpacity={0.6} />,
          ])}

          {ALL_SENSORS.filter(s => activeSensors.has(s)).map(s => (
            <Line key={s} type="monotone" dataKey={s} stroke={SENSOR_CONFIG[s].color}
              dot={false} strokeWidth={2} isAnimationActive={false} />
          ))}

          {/* zoom/pan brush scrubber */}
          <Brush
            dataKey="timestamp"
            startIndex={startIndex}
            endIndex={endIndex}
            height={28}
            travellerWidth={8}
            stroke="#475569"
            fill="#1e293b"
            onChange={({ startIndex: si, endIndex: ei }) => setBrushRange({ startIndex: si, endIndex: ei })}
          >
            <LineChart>
              {ALL_SENSORS.filter(s => activeSensors.has(s)).map(s => (
                <Line key={s} type="monotone" dataKey={s} stroke={SENSOR_CONFIG[s].color}
                  dot={false} strokeWidth={1} isAnimationActive={false} />
              ))}
            </LineChart>
          </Brush>
        </LineChart>
      </ResponsiveContainer>

      <p className="text-[10px] text-slate-500 text-right">
        Drag the scrubber below the chart to pan · Use ⊕ ⊖ to zoom · Dashed lines = thresholds
      </p>
    </div>
  );
}
