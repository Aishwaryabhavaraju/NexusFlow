import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useAlerts } from '../../context/AlertContext';

const SEVERITY_COLORS = {
  critical: '#ef4444',
  warn:     '#f59e0b',
  info:     '#3b82f6',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <span style={{ color: SEVERITY_COLORS[name] }} className="font-bold capitalize">{name}</span>
      <span className="text-slate-300 ml-2">{value} alert{value !== 1 ? 's' : ''}</span>
    </div>
  );
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AlertBreakdownChart() {
  const { alerts } = useAlerts();

  const data = useMemo(() => {
    const counts = { critical: 0, warn: 0, info: 0 };
    alerts.forEach(a => { if (counts[a.severity] !== undefined) counts[a.severity]++; });
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [alerts]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Alert Breakdown</h2>
        <span className="text-xs text-slate-400">{total} total</span>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-slate-500 gap-2">
          <span className="text-2xl">🟢</span>
          <span className="text-xs">No alerts yet — all systems normal</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name] ?? '#64748b'} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ fontSize: 11, color: '#cbd5e1', textTransform: 'capitalize' }}>{value}</span>
              )}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      )}

      <div className="grid grid-cols-3 gap-2 mt-1">
        {[['critical','#ef4444'],['warn','#f59e0b'],['info','#3b82f6']].map(([sev, color]) => {
          const count = alerts.filter(a => a.severity === sev).length;
          return (
            <div key={sev} className="text-center">
              <div className="text-lg font-bold" style={{ color }}>{count}</div>
              <div className="text-[10px] text-slate-500 capitalize">{sev}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
