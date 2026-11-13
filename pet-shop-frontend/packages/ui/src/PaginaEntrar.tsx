import type { ComponentProps } from 'react';
import { Cartao } from './Cartao';
import { FormularioEntrar } from './FormularioEntrar';
import { Marca } from './Marca';
import { ASSINATURA } from './marca';

type Props = {
  titulo: string;
  descricao: string;
  onEntrar?: ComponentProps<typeof FormularioEntrar>['onEntrar'];
};

// shortcut: sem requisição, o backend ainda não expõe POST /auth/login do contrato v2; cada app passa o seu onEntrar quando o cliente OpenAPI existir (ADR-010, passo 1).
const servidorEmConstrucao = () => {
  throw new Error('Ainda não dá para entrar: o servidor novo está em construção.');
};

/** Tela de entrar (T1), igual na loja e no tutor a não ser pelos textos. */
export function PaginaEntrar({ titulo, descricao, onEntrar = servidorEmConstrucao }: Props) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-4 py-8">
      <header className="space-y-2">
        <Marca />
        <p className="text-body-md text-on-surface-variant">{ASSINATURA}</p>
      </header>
      <Cartao className="space-y-4">
        <div>
          <h1 className="text-title-lg text-on-surface">{titulo}</h1>
          <p className="text-body-md text-on-surface-variant">{descricao}</p>
        </div>
        <FormularioEntrar onEntrar={onEntrar} />
      </Cartao>
    </main>
  );
}
