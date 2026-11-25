import React, { useState, useEffect } from 'react';
import { X, RotateCcw, SlidersHorizontal, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAlerts, DEFAULT_THRESHOLDS } from '../../context/AlertContext';

const SENSOR_META = {
  temperature: { label: 'Temperature', unit: '°C', step: '1' },
  pressure:    { label: 'Pressure',    unit: 'bar', step: '0.1' },
  vibration:   { label: 'Vibration',   unit: 'mm/s', step: '0.1' },
};

export default function ThresholdEditorModal({ open, onClose }) {
  const { thresholds, updateThresholds, resetThresholds } = useAlerts();
  const [draft, setDraft] = useState(thresholds);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setDraft(
        Object.fromEntries(
          Object.entries(thresholds).map(([k, v]) => [k, { warn: String(v.warn), critical: String(v.critical) }])
        )
      );
      setError('');
    }
  }, [open, thresholds]);

  if (!open) return null;

  const handleChange = (sensor, field, value) => {
    setDraft((prev) => ({
      ...prev,
      [sensor]: { ...prev[sensor], [field]: value },
    }));
    setError('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    const parsed = {};
    for (const sensor of Object.keys(SENSOR_META)) {
      const warn = Number(draft[sensor]?.warn);
      const critical = Number(draft[sensor]?.critical);
      if (!Number.isFinite(warn) || !Number.isFinite(critical) || warn < 0 || critical <= 0) {
        setError(`Please enter valid positive numbers for ${SENSOR_META[sensor].label}.`);
        return;
      }
      if (warn >= critical) {
        setError(`${SENSOR_META[sensor].label}: warning threshold must be less than critical threshold.`);
        return;
      }
      parsed[sensor] = { warn, critical };
    }
    updateThresholds(parsed);
    toast.success('Alert thresholds updated');
    onClose();
  };

  const handleReset = () => {
    resetThresholds();
    setDraft(
      Object.fromEntries(
        Object.entries(DEFAULT_THRESHOLDS).map(([k, v]) => [k, { warn: String(v.warn), critical: String(v.critical) }])
      )
    );
    setError('');
    toast.success('Thresholds reset to defaults');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30">
              <SlidersHorizontal size={16} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Alert Thresholds</h2>
              <p className="text-[11px] text-slate-400">Customize warning and critical trigger levels</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close thresholds editor"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
          {Object.entries(SENSOR_META).map(([sensor, meta]) => (
            <div key={sensor} className="bg-slate-800/50 border border-slate-700/80 rounded-xl p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">{meta.label}</span>
                <span className="text-[11px] text-slate-400">Unit: {meta.unit}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-yellow-400 font-medium">Warning ({meta.unit})</span>
                  <input
                    type="number"
                    step={meta.step}
                    min="0"
                    value={draft[sensor]?.warn ?? ''}
                    onChange={(e) => handleChange(sensor, 'warn', e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-yellow-500 tabular-nums"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[11px] text-red-400 font-medium">Critical ({meta.unit})</span>
                  <input
                    type="number"
                    step={meta.step}
                    min="0"
                    value={draft[sensor]?.critical ?? ''}
                    onChange={(e) => handleChange(sensor, 'critical', e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-red-500 tabular-nums"
                  />
                </label>
              </div>
            </div>
          ))}

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/60 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RotateCcw size={13} /> Reset defaults
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-1.5 rounded-lg transition-colors"
              >
                <Save size={13} /> Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
