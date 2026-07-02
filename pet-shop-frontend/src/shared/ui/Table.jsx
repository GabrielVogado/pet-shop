import React from 'react';

export function TableHead({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink/65">
      {children}
    </th>
  );
}

export function TableCell({ children }) {
  return <td className="whitespace-nowrap px-4 py-4 text-sm text-ink/75">{children}</td>;
}

export function Table({ children, className }) {
  return (
    <table className={`min-w-full divide-y divide-ink/10 ${className || ''}`}>
      {children}
    </table>
  );
}

export function TableHeader({ children }) {
  return <thead className="bg-mint/65">{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-ink/10">{children}</tbody>;
}
