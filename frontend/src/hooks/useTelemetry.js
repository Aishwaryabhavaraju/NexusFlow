import { useEffect, useRef, useState } from 'react';

const MAX_POINTS = 60;
const SENSORS = ['temperature', 'pressure', 'vibration'];

function generatePoint(prev) {
  return {
    timestamp: new Date().toLocaleTimeString(),
    temperature: +(Math.min(120, Math.max(10, (prev?.temperature ?? 65) + (Math.random() - 0.48) * 4)).toFixed(1)),
    pressure:    +(Math.min(10,  Math.max(0,  (prev?.pressure    ?? 4.5) + (Math.random() - 0.5) * 0.3)).toFixed(2)),
    vibration:   +(Math.min(5,   Math.max(0,  (prev?.vibration   ?? 1.2) + (Math.random() - 0.5) * 0.2)).toFixed(2)),
  };
}

export function useTelemetry(liveData) {
  const [series, setSeries] = useState(() => {
    const pts = [];
    for (let i = 0; i < 30; i++) pts.push(generatePoint(pts[pts.length - 1]));
    return pts;
  });
  const simulationRef = useRef(null);

  useEffect(() => {
    if (liveData) {
      setSeries((prev) => [...prev, { timestamp: new Date().toLocaleTimeString(), ...liveData }].slice(-MAX_POINTS));
      return;
    }
    simulationRef.current = setInterval(() => {
      setSeries((prev) => [...prev, generatePoint(prev[prev.length - 1])].slice(-MAX_POINTS));
    }, 1000);
    return () => clearInterval(simulationRef.current);
  }, [liveData]);

  return { series, latest: series[series.length - 1] ?? {}, sensors: SENSORS };
}
