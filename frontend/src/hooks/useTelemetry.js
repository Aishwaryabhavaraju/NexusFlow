import { useEffect, useRef, useState } from 'react';
import { MOCK_DEVICES } from '../constants/devices';

const MAX_POINTS = 60;
const SENSORS = ['temperature', 'pressure', 'vibration'];

function generateDevicePoint(prev, baseline) {
  const base = baseline || {
    temperature: 65,
    tempVariance: 2.5,
    pressure: 4.5,
    pressureVariance: 0.25,
    vibration: 1.2,
    vibrationVariance: 0.15,
  };

  const prevTemp = prev?.temperature ?? base.temperature;
  const prevPress = prev?.pressure ?? base.pressure;
  const prevVib = prev?.vibration ?? base.vibration;

  // Drift gently towards baseline with stochastic variance
  const nextTemp = prevTemp + (base.temperature - prevTemp) * 0.12 + (Math.random() - 0.49) * (base.tempVariance * 1.5);
  const nextPress = prevPress + (base.pressure - prevPress) * 0.12 + (Math.random() - 0.5) * (base.pressureVariance * 1.5);
  const nextVib = prevVib + (base.vibration - prevVib) * 0.12 + (Math.random() - 0.49) * (base.vibrationVariance * 1.5);

  return {
    timestamp: new Date().toLocaleTimeString(),
    temperature: +Math.min(130, Math.max(10, nextTemp)).toFixed(1),
    pressure: +Math.min(11, Math.max(0, nextPress)).toFixed(2),
    vibration: +Math.min(6, Math.max(0, nextVib)).toFixed(2),
  };
}

function initDeviceHistory(device) {
  const pts = [];
  let last = null;
  for (let i = 0; i < 30; i++) {
    last = generateDevicePoint(last, device.baseline);
    pts.push(last);
  }
  return pts;
}

export function useTelemetry(liveData, selectedDevice) {
  const activeDevice = selectedDevice || MOCK_DEVICES[0];
  const activeDeviceId = activeDevice.id;

  // Map of deviceId -> series array
  const [deviceSeries, setDeviceSeries] = useState(() => {
    const map = {};
    for (const d of MOCK_DEVICES) {
      map[d.id] = initDeviceHistory(d);
    }
    return map;
  });

  const simulationRef = useRef(null);

  useEffect(() => {
    if (liveData) {
      // If live WebSocket data is incoming, append to current active device
      setDeviceSeries((prev) => {
        const cur = prev[activeDeviceId] || [];
        const next = [...cur, { timestamp: new Date().toLocaleTimeString(), ...liveData }].slice(-MAX_POINTS);
        return { ...prev, [activeDeviceId]: next };
      });
      return;
    }

    // Run continuous simulation for all devices simultaneously
    simulationRef.current = setInterval(() => {
      setDeviceSeries((prev) => {
        const updated = { ...prev };
        for (const dev of MOCK_DEVICES) {
          const cur = updated[dev.id] || [];
          const lastPoint = cur[cur.length - 1];
          const newPoint = generateDevicePoint(lastPoint, dev.baseline);
          updated[dev.id] = [...cur, newPoint].slice(-MAX_POINTS);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(simulationRef.current);
  }, [liveData, activeDeviceId]);

  const currentSeries = deviceSeries[activeDeviceId] || [];
  const latest = currentSeries[currentSeries.length - 1] ?? {};

  return {
    series: currentSeries,
    latest,
    sensors: SENSORS,
    activeDevice,
  };
}
