import type { HTMLAttributes } from 'react';

/** Superfície de cartão: borda no lugar de sombra (Identidade visual, seção 5). */
export function Cartao({ className = '', ...resto }: HTMLAttributes<HTMLDivElement>) {
  return <div {...resto} className={`rounded-2xl border border-outline-variant bg-surface-lowest p-4 ${className}`} />;
}
