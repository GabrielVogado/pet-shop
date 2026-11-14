import { NOME_PRODUTO } from './textos-marca';

/**
 * Assinatura visual: símbolo + nome em minúsculas, "per" em Asfalto e "tim" em Pinheiro.
 * `empilhada` põe o símbolo em cima e o nome grande embaixo, como na tela de entrar (T1).
 */
export function Marca({ empilhada = false }: { empilhada?: boolean }) {
  return (
    <span
      className={empilhada ? 'inline-flex flex-col items-center gap-1' : 'inline-flex items-center gap-2'}
      role="img"
      aria-label={NOME_PRODUTO}
    >
      <img src="/pertim-simbolo.svg" alt="" className={empilhada ? 'h-16 w-16' : 'h-10 w-10'} />
      <span
        aria-hidden="true"
        className={`whitespace-nowrap font-display font-extrabold lowercase ${empilhada ? 'text-display-sm' : 'text-headline-sm'}`}
      >
        <span className="text-on-surface">per</span>
        <span className="text-primary">tim</span>
      </span>
    </span>
  );
}
