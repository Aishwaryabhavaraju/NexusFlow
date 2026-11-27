import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { MOCK_DEVICES } from '../constants/devices';

const DeviceContext = createContext(null);
const STORAGE_KEY = 'nexusflow_selected_device';

export function DeviceProvider({ children }) {
  const [selectedDeviceId, setSelectedDeviceId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && MOCK_DEVICES.some((d) => d.id === saved)) {
        return saved;
      }
    } catch {
      // Ignore storage errors
    }
    return MOCK_DEVICES[0].id;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, selectedDeviceId);
    } catch {
      // Ignore storage errors
    }
  }, [selectedDeviceId]);

  const selectedDevice = useMemo(() => {
    return MOCK_DEVICES.find((d) => d.id === selectedDeviceId) || MOCK_DEVICES[0];
  }, [selectedDeviceId]);

  return (
    <DeviceContext.Provider
      value={{
        devices: MOCK_DEVICES,
        selectedDeviceId,
        selectedDevice,
        setSelectedDeviceId,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error('useDevice must be inside <DeviceProvider>');
  return ctx;
}
