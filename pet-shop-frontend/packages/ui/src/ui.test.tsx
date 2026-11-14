import { render, screen } from '@testing-library/react';
import { Botao, Campo, Selo } from './index';

describe('Campo', () => {
  it('liga o erro ao campo e o anuncia', () => {
    render(<Campo rotulo="E-mail" erro="Informe um e-mail válido." />);

    const campo = screen.getByLabelText('E-mail');
    expect(campo).toBeInvalid();
    expect(campo).toHaveAccessibleDescription('Informe um e-mail válido.');
    expect(screen.getByRole('alert')).toHaveTextContent('Informe um e-mail válido.');
  });

  it('mostra a dica sem marcar o campo como inválido', () => {
    render(<Campo rotulo="Senha" dica="Mínimo de 8 caracteres." />);

    const campo = screen.getByLabelText('Senha');
    expect(campo).toBeValid();
    expect(campo).toHaveAccessibleDescription('Mínimo de 8 caracteres.');
  });
});

describe('Botao', () => {
  it('fica desabilitado e ocupado enquanto carrega', () => {
    render(<Botao carregando>Entrar</Botao>);

    const botao = screen.getByRole('button', { name: 'Entrar' });
    expect(botao).toBeDisabled();
    expect(botao).toHaveAttribute('aria-busy', 'true');
  });
});

describe('Selo', () => {
  it.each([
    ['aguardando-loja', 'Aguardando a loja'],
    ['concluido', 'Concluído'],
    ['expirado', 'Expirado']
  ] as const)('escreve o estado %s por extenso', (estado, texto) => {
    render(<Selo estado={estado} />);

    expect(screen.getByText(texto)).toBeVisible();
  });
});
