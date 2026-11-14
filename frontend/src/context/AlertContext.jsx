import React, { createContext, useContext, useReducer, useCallback } from 'react';
import toast from 'react-hot-toast';

const initialState = { alerts: [] };

function alertReducer(state, action) {
  switch (action.type) {
    case 'ADD_ALERT':
      return { ...state, alerts: [{ id: `alert-${Date.now()}`, acknowledged: false, timestamp: new Date().toISOString(), ...action.payload }, ...state.alerts].slice(0, 100) };
    case 'ACKNOWLEDGE':
      return { ...state, alerts: state.alerts.map((a) => a.id === action.id ? { ...a, acknowledged: true } : a) };
    case 'CLEAR_ALL':
      return { ...state, alerts: [] };
    default:
      return state;
  }
}

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [state, dispatch] = useReducer(alertReducer, initialState);

  const addAlert = useCallback((payload) => {
    dispatch({ type: 'ADD_ALERT', payload });
    const msg = payload.message ?? `${payload.sensor} alert: ${payload.value}`;
    payload.severity === 'critical' ? toast.error(msg, { duration: 6000, icon: '🚨' }) : toast(msg, { duration: 4000, icon: '⚠️' });
  }, []);

  const acknowledge = useCallback((id) => dispatch({ type: 'ACKNOWLEDGE', id }), []);
  const clearAll = useCallback(() => dispatch({ type: 'CLEAR_ALL' }), []);

  return (
    <AlertContext.Provider value={{ alerts: state.alerts, unreadCount: state.alerts.filter(a => !a.acknowledged).length, addAlert, acknowledge, clearAll }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlerts must be inside <AlertProvider>');
  return ctx;
}
