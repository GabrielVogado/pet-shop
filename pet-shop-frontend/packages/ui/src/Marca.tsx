import { NOME_PRODUTO } from './marca';

/** Assinatura visual: símbolo + nome em minúsculas, "per" em Asfalto e "tim" em Pinheiro. */
export function Marca() {
  return (
    <span className="inline-flex items-center gap-2" role="img" aria-label={NOME_PRODUTO}>
      <img src="/pertim-simbolo.svg" alt="" className="h-10 w-10" />
      <span aria-hidden="true" className="font-display text-headline-sm font-extrabold lowercase">
        <span className="text-on-surface">per</span>
        <span className="text-primary">tim</span>
      </span>
    </span>
  );
}
