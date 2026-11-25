import React, { createContext, useContext, useReducer, useCallback, useState, useMemo, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { playCriticalAlertSound } from '../utils/alertSound';

export const DEFAULT_THRESHOLDS = {
  temperature: { warn: 80, critical: 100 },
  pressure:    { warn: 7.5, critical: 9 },
  vibration:   { warn: 3.5, critical: 4.5 },
};

const THRESHOLDS_STORAGE_KEY = 'nexusflow_thresholds';
const SOUND_STORAGE_KEY = 'nexusflow_sound_enabled';

function loadStoredThresholds() {
  try {
    const raw = localStorage.getItem(THRESHOLDS_STORAGE_KEY);
    if (!raw) return DEFAULT_THRESHOLDS;
    const parsed = JSON.parse(raw);
    const merged = {};
    for (const key of Object.keys(DEFAULT_THRESHOLDS)) {
      const warn = Number(parsed?.[key]?.warn);
      const critical = Number(parsed?.[key]?.critical);
      if (Number.isFinite(warn) && Number.isFinite(critical) && warn < critical) {
        merged[key] = { warn, critical };
      } else {
        merged[key] = { ...DEFAULT_THRESHOLDS[key] };
      }
    }
    return merged;
  } catch {
    return DEFAULT_THRESHOLDS;
  }
}

function loadStoredSoundEnabled() {
  try {
    const raw = localStorage.getItem(SOUND_STORAGE_KEY);
    return raw === null ? true : raw === 'true';
  } catch {
    return true;
  }
}

function isToday(isoTimestamp) {
  if (!isoTimestamp) return false;
  const d = new Date(isoTimestamp);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

const initialState = { alerts: [] };

function alertReducer(state, action) {
  switch (action.type) {
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [
          {
            id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            acknowledged: false,
            timestamp: new Date().toISOString(),
            ...action.payload,
          },
          ...state.alerts,
        ].slice(0, 100),
      };
    case 'ACKNOWLEDGE':
      return { ...state, alerts: state.alerts.map((a) => (a.id === action.id ? { ...a, acknowledged: true } : a)) };
    case 'CLEAR_ALL':
      return { ...state, alerts: [] };
    default:
      return state;
  }
}

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [state, dispatch] = useReducer(alertReducer, initialState);
  const [thresholds, setThresholds] = useState(loadStoredThresholds);
  const [soundEnabled, setSoundEnabled] = useState(loadStoredSoundEnabled);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
    } catch {
      // Ignore storage errors
    }
  }, [soundEnabled]);

  const updateThresholds = useCallback((nextThresholds) => {
    setThresholds(nextThresholds);
    try {
      localStorage.setItem(THRESHOLDS_STORAGE_KEY, JSON.stringify(nextThresholds));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const resetThresholds = useCallback(() => {
    setThresholds(DEFAULT_THRESHOLDS);
    try {
      localStorage.removeItem(THRESHOLDS_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const addAlert = useCallback((payload) => {
    dispatch({ type: 'ADD_ALERT', payload });
    const msg = payload.message ?? `${payload.sensor} alert: ${payload.value}`;
    if (payload.severity === 'critical') {
      toast.error(msg, { duration: 6000, icon: '🚨' });
      if (soundEnabledRef.current) {
        playCriticalAlertSound();
      }
    } else {
      toast(msg, { duration: 4000, icon: '⚠️' });
    }
  }, []);

  const acknowledge = useCallback((id) => dispatch({ type: 'ACKNOWLEDGE', id }), []);
  const clearAll = useCallback(() => dispatch({ type: 'CLEAR_ALL' }), []);

  const todayCounts = useMemo(() => {
    const counts = { critical: 0, warn: 0, info: 0 };
    for (const a of state.alerts) {
      if (isToday(a.timestamp) && counts[a.severity] !== undefined) {
        counts[a.severity] += 1;
      }
    }
    return counts;
  }, [state.alerts]);

  return (
    <AlertContext.Provider
      value={{
        alerts: state.alerts,
        unreadCount: state.alerts.filter((a) => !a.acknowledged).length,
        todayCounts,
        thresholds,
        updateThresholds,
        resetThresholds,
        soundEnabled,
        toggleSound,
        addAlert,
        acknowledge,
        clearAll,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlerts must be inside <AlertProvider>');
  return ctx;
}
