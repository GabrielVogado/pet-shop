import React from 'react';

export function Field({ label, type = 'text', step, value, placeholder, onChange, required = true }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink/70">{label}</span>
      <input
        required={required}
        type={type}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 min-h-11 w-full rounded border border-ink/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/15"
      />
    </label>
  );
}
