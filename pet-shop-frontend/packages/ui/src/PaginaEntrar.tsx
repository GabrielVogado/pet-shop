import type { ComponentProps } from 'react';
import { FormularioEntrar } from './FormularioEntrar';
import { Marca } from './Marca';
import { ASSINATURA } from './textos-marca';

type Props = Omit<ComponentProps<typeof FormularioEntrar>, 'onEntrar'> & {
  /** Nome da página para leitor de tela e aba; o protótipo T1 não mostra título visível. */
  titulo: string;
  onEntrar?: ComponentProps<typeof FormularioEntrar>['onEntrar'];
};

// shortcut: sem requisição, o backend ainda não expõe POST /auth/login do contrato v2; cada app passa o seu onEntrar quando o cliente OpenAPI existir (ADR-010, passo 1).
const servidorEmConstrucao = () => {
  throw new Error('Ainda não dá para entrar: o servidor novo está em construção.');
};

/** Tela de entrar (T1), na disposição do protótipo (Documentos/03-ui-ux/apresentacao/telas/t1.png). */
export function PaginaEntrar({ titulo, onEntrar = servidorEmConstrucao, ...opcoes }: Props) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-6 pt-12 sm:justify-center">
      <h1 className="sr-only">{titulo}</h1>
      <header className="mb-8 flex flex-col items-center gap-1 text-center">
        <Marca empilhada />
        <p className="text-body-lg text-on-surface-variant">{ASSINATURA}</p>
      </header>
      <FormularioEntrar onEntrar={onEntrar} {...opcoes} />
    </main>
  );
}
