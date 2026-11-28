import React from 'react';
import './Badge.css';

export default function Badge({
  children,
  variant = 'cyan', // cyan | green | amber | rose | neutral
  size = 'sm',
  className = ''
}) {
  return (
    <span className={`nf-badge nf-badge--${variant} nf-badge--${size} ${className}`}>
      {children}
    </span>
  );
}
