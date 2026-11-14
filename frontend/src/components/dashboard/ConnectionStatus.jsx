import React from 'react';
import { Wifi, WifiOff, AlertCircle, Loader } from 'lucide-react';

const CONFIG = {
  connected:    { icon: Wifi,       color: 'text-green-400',  bg: 'bg-green-900/30 border-green-700',   label: 'Live' },
  connecting:   { icon: Loader,     color: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-700', label: 'Connecting…' },
  disconnected: { icon: WifiOff,    color: 'text-gray-400',   bg: 'bg-gray-800 border-gray-600',         label: 'Disconnected' },
  error:        { icon: AlertCircle,color: 'text-red-400',    bg: 'bg-red-900/30 border-red-700',        label: 'Error' },
};

export default function ConnectionStatus({ status }) {
  const cfg = CONFIG[status] ?? CONFIG.disconnected;
  const Icon = cfg.icon;
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${cfg.bg} ${cfg.color}`}>
      <Icon size={13} className={status === 'connecting' ? 'animate-spin' : ''} />
      {cfg.label}
      {status === 'connected' && <span className="ml-1 w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
    </div>
  );
}
