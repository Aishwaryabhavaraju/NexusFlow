import React, { useEffect, useRef, useState } from 'react';
import { Radio } from 'lucide-react';

const SENSOR_COLORS = {
  temperature: '#f97316',
  pressure:    '#38bdf8',
  vibration:   '#a78bfa',
};

/**
 * DataFlowIndicator — shows animated dots streaming in from left to right
 * with a "packets received" counter and per-sensor colour coding.
 */
export default function DataFlowIndicator({ latest, sensors }) {
  const [packets, setPackets] = useState(0);
  const [drops, setDrops]     = useState([]); // { id, sensor, x, opacity }
  const idRef = useRef(0);

  // Every time latest updates, spawn animated drops
  useEffect(() => {
    if (!latest) return;
    setPackets(p => p + 1);

    const newDrops = sensors.map((sensor, i) => ({
      id:     ++idRef.current,
      sensor,
      x:      0,
      delay:  i * 80,
      color:  SENSOR_COLORS[sensor] ?? '#64748b',
    }));
    setDrops(prev => [...prev, ...newDrops].slice(-30)); // cap

    // remove after animation
    const t = setTimeout(() => {
      setDrops(prev => prev.filter(d => !newDrops.find(n => n.id === d.id)));
    }, 1800);
    return () => clearTimeout(t);
  }, [latest]);

  return (
    <div className="bg-slate-800/60 border border-slate-700 light-card rounded-xl px-4 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200 light-text uppercase tracking-wider">
            Data Flow
          </span>
        </div>
        <span className="text-[10px] text-slate-400 tabular-nums">
          {packets.toLocaleString()} packets
        </span>
      </div>

      {/* Flow lane */}
      <div className="relative h-10 overflow-hidden rounded-lg bg-slate-900/60 border border-slate-700">
        {/* grid lines */}
        {[25, 50, 75].map(p => (
          <div key={p} className="absolute top-0 bottom-0 w-px bg-slate-700/50" style={{ left: `${p}%` }} />
        ))}

        {/* animated packets */}
        {drops.map(drop => (
          <div
            key={drop.id}
            className="absolute top-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 8,
              height: 8,
              backgroundColor: drop.color,
              boxShadow: `0 0 8px 2px ${drop.color}88`,
              animation: `flowRight 1.6s ${drop.delay}ms ease-in forwards`,
            }}
          />
        ))}

        {/* sensor labels */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
          {sensors.map(s => (
            <div
              key={s}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: SENSOR_COLORS[s] ?? '#64748b', boxShadow: `0 0 4px ${SENSOR_COLORS[s] ?? '#64748b'}` }}
              title={s}
            />
          ))}
        </div>
      </div>

      {/* per-sensor rate pills */}
      <div className="flex gap-2 flex-wrap">
        {sensors.map(s => (
          <div key={s} className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SENSOR_COLORS[s], display: 'inline-block' }} />
            <span className="capitalize">{s}</span>
            <span className="text-slate-500">1 Hz</span>
          </div>
        ))}
      </div>
    </div>
  );
}
