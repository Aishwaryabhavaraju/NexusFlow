import React from 'react';

export default function FormField({
  label,
  children,
  helperText,
  suffix,
  className = ''
}) {
  return (
    <div className={`nf-form-group ${className}`}>
      {label && <label className="nf-form-label">{label}</label>}
      <div className="nf-form-input-wrapper">
        {children}
        {suffix && <span className="nf-form-input-suffix">{suffix}</span>}
      </div>
      {helperText && <span className="nf-form-helper">{helperText}</span>}
    </div>
  );
}
