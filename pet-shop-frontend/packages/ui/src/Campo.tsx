import { useId, type InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  rotulo: string;
  dica?: string;
  erro?: string;
};

export function Campo({ rotulo, dica, erro, className = '', id: idDado, ...resto }: Props) {
  const idGerado = useId();
  const id = idDado ?? idGerado;
  const idApoio = `${id}-apoio`;
  const apoio = erro || dica;

  return (
    <div className={className}>
      <label htmlFor={id} className="text-label-lg text-on-surface">
        {rotulo}
      </label>
      <input
        {...resto}
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={apoio ? idApoio : undefined}
        className={`mt-1 min-h-12 w-full rounded-xl border bg-surface-lowest px-3 text-body-lg text-on-surface outline-none transition duration-150 focus:ring-2 motion-reduce:transition-none ${
          erro ? 'border-error focus:ring-error' : 'border-outline focus:border-primary'
        }`}
      />
      {apoio && (
        <p id={idApoio} role={erro ? 'alert' : undefined} className={`mt-1 text-body-md ${erro ? 'text-error' : 'text-on-surface-variant'}`}>
          {apoio}
        </p>
      )}
    </div>
  );
}
