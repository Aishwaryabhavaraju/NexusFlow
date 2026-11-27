import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Cpu, Check, MapPin, Gauge, AlertCircle } from 'lucide-react';
import { useDevice } from '../../context/DeviceContext';

const STATUS_CONFIG = {
  online: {
    color: 'bg-emerald-500',
    badge: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  },
  warning: {
    color: 'bg-amber-500',
    badge: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  },
  critical: {
    color: 'bg-rose-500',
    badge: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
  },
};

export default function DeviceSelector() {
  const { devices, selectedDevice, selectedDeviceId, setSelectedDeviceId } = useDevice();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeStatus = STATUS_CONFIG[selectedDevice.status] || STATUS_CONFIG.online;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 light-card transition-all text-xs font-medium text-slate-200 light-text shadow-sm"
      >
        <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Cpu size={14} />
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white light-text text-xs leading-none">
              {selectedDevice.name}
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">[{selectedDevice.tag}]</span>
          </div>
          <span className="text-[10px] text-slate-400 light-muted truncate max-w-[150px] mt-0.5">
            {selectedDevice.location}
          </span>
        </div>

        <span
          className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-semibold border flex items-center gap-1 ${activeStatus.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${activeStatus.color}`} />
          {selectedDevice.statusLabel}
        </span>

        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 bg-slate-800/50">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Select Monitored Machine
            </p>
          </div>

          <div className="p-1 flex flex-col gap-1 max-h-64 overflow-y-auto scrollbar-thin">
            {devices.map((device) => {
              const isSelected = device.id === selectedDeviceId;
              const statusCfg = STATUS_CONFIG[device.status] || STATUS_CONFIG.online;

              return (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => {
                    setSelectedDeviceId(device.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-500/30 text-white'
                      : 'hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs truncate">{device.name}</span>
                      <span className="text-[9px] font-mono text-cyan-400">[{device.tag}]</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin size={10} className="shrink-0 text-slate-500" />
                      <span className="truncate">{device.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[9px] text-slate-400 mt-1">
                      <span>Base: {device.baseline.temperature}°C</span>
                      <span>·</span>
                      <span>{device.baseline.pressure} bar</span>
                      <span>·</span>
                      <span>{device.baseline.vibration} mm/s</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${statusCfg.badge}`}
                    >
                      {device.statusLabel}
                    </span>
                    {isSelected && <Check size={14} className="text-cyan-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
