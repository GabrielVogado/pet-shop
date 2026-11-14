// Estados do pedido e suas cores (Identidade visual, seção 3.4). O selo sempre tem texto: estado nunca é só cor.
const aguardando = 'bg-secondary-container text-on-secondary-container';
const encerradoSemAtendimento = 'bg-error-container text-on-error-container';

const estados = {
  'aguardando-pagamento': ['Aguardando pagamento', aguardando],
  'aguardando-loja': ['Aguardando a loja', aguardando],
  confirmado: ['Confirmado', 'bg-primary-container text-on-primary-container'],
  concluido: ['Concluído', 'bg-surface-highest text-on-surface-variant'],
  recusado: ['Recusado', encerradoSemAtendimento],
  cancelado: ['Cancelado', encerradoSemAtendimento],
  expirado: ['Expirado', encerradoSemAtendimento]
} as const;

export type EstadoPedido = keyof typeof estados;

export function Selo({ estado }: { estado: EstadoPedido }) {
  const [texto, cores] = estados[estado];
  return <span className={`inline-flex items-center rounded-lg px-2 py-1 text-label-md ${cores}`}>{texto}</span>;
}
