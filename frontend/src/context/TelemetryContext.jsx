import React, { createContext, useContext, useState, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

const TelemetryContext = createContext(null);
const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:4000';

export function TelemetryProvider({ children, onAlert }) {
  const [latestPayload, setLatestPayload] = useState(null);

  const handleMessage = useCallback((data) => {
    if (data.type === 'telemetry') setLatestPayload(data.payload);
  }, []);

  const { status, send } = useWebSocket(WS_URL, { onMessage: handleMessage, onAlert });

  return (
    <TelemetryContext.Provider value={{ wsStatus: status, latestPayload, send }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetryContext() {
  const ctx = useContext(TelemetryContext);
  if (!ctx) throw new Error('useTelemetryContext must be inside <TelemetryProvider>');
  return ctx;
}
