import type { ButtonHTMLAttributes } from 'react';

const variantes = {
  principal: 'bg-primary text-on-primary hover:bg-primary/90',
  secundario: 'border border-outline bg-surface-lowest text-primary hover:bg-primary-container',
  texto: 'text-primary hover:bg-primary-container',
  perigo: 'bg-error text-on-error hover:bg-error/90'
} as const;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: keyof typeof variantes;
  carregando?: boolean;
};

export function Botao({ variante = 'principal', carregando = false, disabled, className = '', children, ...resto }: Props) {
  return (
    <button
      type="button"
      {...resto}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      className={`inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-2xl px-4 text-label-lg transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none ${variantes[variante]} ${className}`}
    >
      {children}
    </button>
  );
}
