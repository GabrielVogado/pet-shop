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
      <span className="text-sm font-bold text-ink/70">{label}</span>
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
        className="mt-1 min-h-11 w-full rounded border border-ink/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/15"
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm font-semibold text-coral" role="alert">
          {error}
        </p>
      )}
    </label>
  );
}