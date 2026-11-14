import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

it('leva qualquer endereço para a tela de entrar e avisa que o servidor ainda não responde', async () => {
  const user = userEvent.setup();
  window.history.pushState({}, '', '/pedidos');
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Entrar no painel da loja' })).toBeVisible();

  await user.type(screen.getByLabelText('E-mail'), 'loja@exemplo.com');
  await user.type(screen.getByLabelText('Senha'), 'segredo123');
  await user.click(screen.getByRole('button', { name: 'Entrar' }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Ainda não dá para entrar');
});
