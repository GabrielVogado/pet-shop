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
