import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AuthScreen } from './AuthScreen';

describe('AuthScreen', () => {
	it('permite cadastrar tutor e retorna para login com email preenchido', async () => {
		const user = userEvent.setup();
		const onRegister = vi.fn(async () => ({ ok: true, message: 'Conta criada com sucesso' }));
		const onLogin = vi.fn(async () => ({ ok: true }));

		render(<AuthScreen onRegister={onRegister} onLogin={onLogin} />);

		await user.click(screen.getByRole('button', { name: 'Cadastro' }));
		await user.click(screen.getByRole('button', { name: /Sou Tutor de Pet/i }));

		await user.type(screen.getByLabelText('Nome'), 'Ana Souza');
		await user.type(screen.getByLabelText('Email'), 'ana@example.com');
		await user.type(screen.getByLabelText('Telefone'), '11999991111');
		await user.type(screen.getByLabelText('Endereco'), 'Rua A, 100');
		await user.type(screen.getByLabelText('Senha'), '123456');
		await user.click(screen.getByRole('checkbox', { name: 'Adicionar primeiro pet agora' }));
		await user.type(screen.getByLabelText('Nome do pet'), 'Loly');
		await user.type(screen.getByLabelText('Raca'), 'Vira-lata');
		await user.type(screen.getByLabelText('Idade'), '3 anos');

		await user.click(screen.getByRole('button', { name: 'Criar conta' }));

		expect(onRegister).toHaveBeenCalledTimes(1);
		expect(onRegister).toHaveBeenCalledWith(
			expect.objectContaining({
				role: 'tutor',
				name: 'Ana Souza',
				email: 'ana@example.com',
				firstPet: expect.objectContaining({
					name: 'Loly',
					breed: 'Vira-lata',
					age: '3 anos'
				})
			})
		);
		expect(await screen.findByText('Conta criada com sucesso')).toBeInTheDocument();
		expect(screen.getByLabelText('Email')).toHaveValue('ana@example.com');
	});

	it('exibe mensagem quando login falha', async () => {
		const user = userEvent.setup();
		const onRegister = vi.fn();
		const onLogin = vi.fn(async () => ({ ok: false, message: 'Credenciais invalidas' }));

		render(<AuthScreen onRegister={onRegister} onLogin={onLogin} />);

		await user.type(screen.getByLabelText('Email'), 'x@example.com');
		await user.type(screen.getByLabelText('Senha'), 'senha-errada');
		await user.click(screen.getByRole('button', { name: 'Entrar' }));

		expect(onLogin).toHaveBeenCalledWith({
			email: 'x@example.com',
			password: 'senha-errada'
		});
		expect(await screen.findByText('Credenciais invalidas')).toBeInTheDocument();
	});
});
