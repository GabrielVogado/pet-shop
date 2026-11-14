import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormularioEntrar } from './FormularioEntrar';

describe('FormularioEntrar', () => {
  it('não envia e aponta os campos quando estão vazios', async () => {
    const user = userEvent.setup();
    const onEntrar = vi.fn();
    render(<FormularioEntrar onEntrar={onEntrar} />);

    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(onEntrar).not.toHaveBeenCalled();
    expect(screen.getByLabelText('E-mail')).toHaveAccessibleDescription('Informe seu e-mail.');
    expect(screen.getByLabelText('Senha')).toHaveAccessibleDescription('Informe sua senha.');
  });

  it('recusa e-mail mal formado', async () => {
    const user = userEvent.setup();
    const onEntrar = vi.fn();
    render(<FormularioEntrar onEntrar={onEntrar} />);

    await user.type(screen.getByLabelText('E-mail'), 'ana@');
    await user.type(screen.getByLabelText('Senha'), 'segredo123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(onEntrar).not.toHaveBeenCalled();
    expect(screen.getByLabelText('E-mail')).toBeInvalid();
  });

  it('entrega as credenciais válidas, com o e-mail sem espaços nas pontas', async () => {
    const user = userEvent.setup();
    const onEntrar = vi.fn();
    render(<FormularioEntrar onEntrar={onEntrar} />);

    await user.type(screen.getByLabelText('E-mail'), ' ana@exemplo.com ');
    await user.type(screen.getByLabelText('Senha'), 'segredo123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(onEntrar).toHaveBeenCalledWith({ email: 'ana@exemplo.com', senha: 'segredo123' });
  });
});

it('mostra a mensagem quando a entrada falha e libera o botão de novo', async () => {
  const user = userEvent.setup();
  const onEntrar = vi.fn().mockRejectedValue(new Error('E-mail ou senha não conferem.'));
  render(<FormularioEntrar onEntrar={onEntrar} />);

  await user.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com');
  await user.type(screen.getByLabelText('Senha'), 'errada');
  await user.click(screen.getByRole('button', { name: 'Entrar' }));

  expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha não conferem.');
  expect(screen.getByRole('button', { name: 'Entrar' })).toBeEnabled();
});

it('o olho mostra e esconde a senha', async () => {
  const user = userEvent.setup();
  render(<FormularioEntrar onEntrar={vi.fn()} />);

  const senha = screen.getByLabelText('Senha');
  expect(senha).toHaveAttribute('type', 'password');

  await user.click(screen.getByRole('button', { name: 'Mostrar senha' }));
  expect(senha).toHaveAttribute('type', 'text');

  await user.click(screen.getByRole('button', { name: 'Esconder senha' }));
  expect(senha).toHaveAttribute('type', 'password');
});

it.each(['Esqueci a senha', 'Entrar com Google', 'Criar conta'])(
  '"%s" avisa que a opção chega em breve enquanto não existe',
  async (opcao) => {
    const user = userEvent.setup();
    render(<FormularioEntrar onEntrar={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: opcao }));

    expect(screen.getByRole('alert')).toHaveTextContent('chega em breve');
  }
);
