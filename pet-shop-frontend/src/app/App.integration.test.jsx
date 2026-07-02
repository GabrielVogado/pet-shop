import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const { sharedApiMocks, streamHookMocks } = vi.hoisted(() => ({
	sharedApiMocks: {
		authApi: {
			register: vi.fn(),
			login: vi.fn()
		},
		petsApi: {
			list: vi.fn(),
			create: vi.fn()
		},
		agendamentosApi: {
			list: vi.fn(),
			availability: vi.fn(),
			create: vi.fn(),
			cancel: vi.fn()
		},
		notificationsApi: {
			list: vi.fn()
		},
		petshopsApi: {
			list: vi.fn()
		},
		servicosApi: {
			catalog: vi.fn(),
			listOwn: vi.fn(),
			create: vi.fn(),
			remove: vi.fn()
		},
		setToken: vi.fn(),
		clearToken: vi.fn()
	},
	streamHookMocks: {
		useServiceCatalogStream: vi.fn(() => false)
	}
}));

vi.mock('../shared/api', () => sharedApiMocks);
vi.mock('../features/service-catalog-stream/model/useServiceCatalogStream', () => streamHookMocks);

import { App } from './App';

async function fillAndSubmitLogin(user, email, password) {
	await user.type(screen.getByLabelText('Email'), email);
	await user.type(screen.getByLabelText('Senha'), password);
	await user.click(screen.getByRole('button', { name: 'Entrar' }));
}

describe('App integration flows', () => {
	beforeEach(() => {
		vi.clearAllMocks();

		sharedApiMocks.petshopsApi.list.mockResolvedValue([
			{ petshopId: 'petshop-central', businessName: 'Petshop Central' }
		]);
		sharedApiMocks.servicosApi.catalog.mockResolvedValue({
			baths: [
				{
					id: 'bath-1',
					name: 'Banho Completo',
					category: 'bath',
					duration: '60 min',
					price: 89.9,
					description: 'Banho completo com secagem',
					features: ['Hidratacao']
				}
			],
			vaccines: []
		});
		sharedApiMocks.notificationsApi.list.mockResolvedValue([]);
		sharedApiMocks.agendamentosApi.availability.mockResolvedValue({
			availableDates: ['2026-07-10'],
			availableTimes: ['10:00']
		});
	});

	it('realiza login de tutor e agenda servico no fluxo principal', async () => {
		const user = userEvent.setup();

		sharedApiMocks.authApi.login.mockResolvedValue({
			token: 'token-tutor',
			user: { id: 'user-1', name: 'Ana Souza', role: 'tutor' }
		});
		sharedApiMocks.petsApi.list.mockResolvedValue([
			{ id: 'pet-1', name: 'Luna', species: 'Cachorro', breed: 'SRD', age: '4' }
		]);
		sharedApiMocks.agendamentosApi.list.mockResolvedValue([]);
		sharedApiMocks.agendamentosApi.create.mockResolvedValue({
			id: 'ag-1',
			userId: 'user-1',
			petId: 'pet-1',
			pet: 'Luna',
			type: 'Banho',
			service: 'Banho Completo',
			status: 'Agendado',
			date: '2026-07-01'
		});

		render(<App />);
		await fillAndSubmitLogin(user, 'ana@example.com', '123456');

		expect(await screen.findByText('PetCare Agenda')).toBeInTheDocument();
		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'Agendar' })).toBeEnabled();
		});

		await user.click(screen.getByRole('button', { name: 'Agendar' }));

		expect(sharedApiMocks.agendamentosApi.create).toHaveBeenCalledTimes(1);
		expect(sharedApiMocks.agendamentosApi.create).toHaveBeenCalledWith(
			expect.objectContaining({
				serviceId: 'bath-1',
				dateTime: '2026-07-10T10:00'
			})
		);
		expect(await screen.findByText('Historico de servicos')).toBeInTheDocument();
	});

	it('realiza login de owner e cancela agendamento no dashboard', async () => {
		const user = userEvent.setup();

		sharedApiMocks.authApi.login.mockResolvedValue({
			token: 'token-owner',
			user: {
				id: 'owner-1',
				name: 'Petshop Central',
				role: 'owner',
				petshopId: 'petshop-central'
			}
		});
		sharedApiMocks.agendamentosApi.list.mockResolvedValue([
			{
				id: 'ag-owner-1',
				userId: 'user-1',
				petId: 'pet-1',
				pet: 'Luna',
				type: 'Banho',
				service: 'Banho Completo',
				status: 'Agendado',
				dateTime: '2026-07-01 10:00',
				petshopId: 'petshop-central'
			}
		]);
		sharedApiMocks.servicosApi.listOwn.mockResolvedValue([
			{
				id: 'svc-1',
				name: 'Banho Completo',
				category: 'bath',
				duration: '60 min',
				price: 89.9
			}
		]);
		sharedApiMocks.agendamentosApi.cancel.mockResolvedValue({
			id: 'ag-owner-1',
			status: 'Cancelado'
		});

		render(<App />);
		await fillAndSubmitLogin(user, 'owner@example.com', '123456');

		expect(await screen.findByText('Dashboard do Petshop')).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Cancelar agendamento' }));

		expect(sharedApiMocks.agendamentosApi.cancel).toHaveBeenCalledWith('ag-owner-1');
	});

	it('realiza cadastro de tutor e owner na tela de autenticacao', async () => {
		const user = userEvent.setup();

		sharedApiMocks.authApi.register.mockResolvedValue({ ok: true });

		render(<App />);

		await user.click(screen.getByRole('button', { name: 'Cadastro' }));
		await user.click(screen.getByRole('button', { name: /Sou Tutor de Pet/i }));
		await user.type(screen.getByLabelText('Nome'), 'Ana Souza');
		await user.type(screen.getByLabelText('Email'), 'ana@example.com');
		await user.type(screen.getByLabelText('Telefone'), '11999990000');
		await user.type(screen.getByLabelText('Endereco'), 'Rua A, 100');
		await user.type(screen.getByLabelText('Senha'), '123456');
		await user.click(screen.getByRole('button', { name: 'Criar conta' }));

		expect(sharedApiMocks.authApi.register).toHaveBeenCalledWith(
			expect.objectContaining({
				role: 'tutor',
				name: 'Ana Souza',
				email: 'ana@example.com',
				firstPet: null
			})
		);
		expect(await screen.findByText(/Cadastro criado\./i)).toBeInTheDocument();
		expect(screen.getByLabelText('Email')).toHaveValue('ana@example.com');

		await user.click(screen.getByRole('button', { name: 'Cadastro' }));
		await user.click(screen.getByRole('button', { name: /Sou Empresa \/ Petshop/i }));
		await user.type(screen.getByLabelText('Nome do responsavel'), 'Carlos Dono');
		await user.type(screen.getByLabelText('Email corporativo'), 'owner@example.com');
		await user.type(screen.getByLabelText('Telefone'), '11988887777');
		await user.type(screen.getByLabelText('Senha'), '654321');
		await user.type(screen.getByLabelText('Razao social / Nome da loja'), 'Pet Shop Central');
		await user.click(screen.getByRole('button', { name: 'Criar conta' }));

		expect(sharedApiMocks.authApi.register).toHaveBeenCalledTimes(2);
		expect(sharedApiMocks.authApi.register).toHaveBeenLastCalledWith(
			expect.objectContaining({
				role: 'owner',
				name: 'Carlos Dono',
				email: 'owner@example.com',
				businessName: 'Pet Shop Central',
				petshopId: expect.stringMatching(/^pet-shop-central-/),
				firstPet: null
			})
		);
	});
});
