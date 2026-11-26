import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ showLabel = false }) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 text-sm font-medium
        ${isDark
          ? 'border-slate-700 bg-slate-800 text-yellow-300 hover:bg-slate-700'
          : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="transition-transform duration-500" style={{ display: 'inline-block', transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)' }}>
        {isDark ? <Moon size={15} /> : <Sun size={15} />}
      </span>
      {showLabel && <span>{isDark ? 'Dark' : 'Light'}</span>}
    </button>
  );
}
