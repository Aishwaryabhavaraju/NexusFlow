import React, { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { AlertProvider, useAlerts } from './context/AlertContext';
import { TelemetryProvider } from './context/TelemetryContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { DeviceProvider } from './context/DeviceContext';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import AlertHistory from './pages/AlertHistory';

function AppShell() {
  const [page, setPage]  = useState('dashboard');
  const { addAlert }     = useAlerts();
  const { isDark }       = useTheme();

  const handleAlert = useCallback((data) => {
    addAlert({
      sensor: data.sensor,
      value: data.value,
      threshold: data.threshold,
      severity: data.severity ?? 'warn',
      message: data.message,
      deviceId: data.deviceId,
      deviceName: data.deviceName,
    });
  }, [addAlert]);

  const bgBase = isDark ? 'bg-slate-950' : 'bg-slate-100';
  const toastStyle = isDark
    ? { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }
    : { background: '#ffffff', color: '#1e293b', border: '1px solid #e2e8f0' };

  return (
    <TelemetryProvider onAlert={handleAlert}>
      <Toaster position="top-right" toastOptions={{ style: toastStyle }} />

      {/* Full-screen flex layout: sidebar + main */}
      <div className={`flex h-screen overflow-hidden ${bgBase} transition-colors duration-300`}>
        {/* Sidebar */}
        <Sidebar activePage={page} onNavigate={setPage} />

        {/* Main content — scrollable */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {page === 'dashboard'
            ? <Dashboard onViewHistory={() => setPage('history')} />
            : <AlertHistory onBack={() => setPage('dashboard')} />
          }
        </main>
      </div>
    </TelemetryProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AlertProvider>
        <DeviceProvider>
          <AppShell />
        </DeviceProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}
