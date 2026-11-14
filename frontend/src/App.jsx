import React, { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { AlertProvider, useAlerts } from './context/AlertContext';
import { TelemetryProvider } from './context/TelemetryContext';
import Dashboard from './pages/Dashboard';
import AlertHistory from './pages/AlertHistory';

function AppContent() {
  const [page, setPage] = useState('dashboard');
  const { addAlert }    = useAlerts();

  const handleAlert = useCallback((data) => {
    addAlert({ sensor: data.sensor, value: data.value, threshold: data.threshold, severity: data.severity ?? 'warn', message: data.message });
  }, [addAlert]);

  return (
    <TelemetryProvider onAlert={handleAlert}>
      {page === 'dashboard'
        ? <Dashboard onViewHistory={() => setPage('history')} />
        : <AlertHistory onBack={() => setPage('dashboard')} />
      }
    </TelemetryProvider>
  );
}

export default function App() {
  return (
    <AlertProvider>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' } }} />
      <AppContent />
    </AlertProvider>
  );
}
