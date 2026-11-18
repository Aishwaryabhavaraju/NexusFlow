import React from 'react';
import './Button.css';

export default function Button({
  children,
  variant = 'secondary', // primary | secondary | danger | ghost | icon
  size = 'md',          // sm | md | lg
  icon: Icon,
  disabled = false,
  className = '',
  onClick,
  title,
  type = 'button'
}) {
  return (
    <button
      type={type}
      className={`nf-btn nf-btn--${variant} nf-btn--${size} ${className}`}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      {Icon && <Icon className="nf-btn__icon" size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      {children && <span className="nf-btn__label">{children}</span>}
    </button>
  );
}
