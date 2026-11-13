import React from 'react';

export function Field({
  label,
  type = 'text',
  step,
  value,
  placeholder,
  onChange,
  required = true,
  id,
  error,
  errorId
}) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <label htmlFor={inputId} className="block">
      <span className="text-sm font-bold text-on-surface-variant">{label}</span>
      <input
        required={required}
        type={type}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="mt-1 min-h-11 w-full rounded-xl border border-outline-variant bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm font-semibold text-error" role="alert">
          {error}
        </p>
      )}
    </label>
  );
}