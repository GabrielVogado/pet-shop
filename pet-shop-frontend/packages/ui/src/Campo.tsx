import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  rotulo: string;
  dica?: string;
  erro?: string;
  /** Botão dentro do campo, à direita (por exemplo, mostrar a senha). */
  acessorio?: ReactNode;
};

export function Campo({ rotulo, dica, erro, acessorio, className = '', id: idDado, ...resto }: Props) {
  const idGerado = useId();
  const id = idDado ?? idGerado;
  const idApoio = `${id}-apoio`;
  const apoio = erro || dica;

  return (
    <div className={className}>
      <label htmlFor={id} className="text-label-lg text-on-surface-variant">
        {rotulo}
      </label>
      <div className="relative mt-1">
        <input
          {...resto}
          id={id}
          aria-invalid={erro ? true : undefined}
          aria-describedby={apoio ? idApoio : undefined}
          className={`min-h-12 w-full rounded-xl border bg-surface-lowest px-4 text-body-lg text-on-surface outline-none transition duration-150 placeholder:text-on-surface-variant focus:ring-2 motion-reduce:transition-none ${
            acessorio ? 'pr-14' : ''
          } ${erro ? 'border-error focus:ring-error' : 'border-outline focus:border-primary'}`}
        />
        {acessorio && <div className="absolute inset-y-0 right-1 flex items-center">{acessorio}</div>}
      </div>
      {apoio && (
        <p id={idApoio} role={erro ? 'alert' : undefined} className={`mt-1 text-body-md ${erro ? 'text-error' : 'text-on-surface-variant'}`}>
          {apoio}
        </p>
      )}
    </div>
  );
}
