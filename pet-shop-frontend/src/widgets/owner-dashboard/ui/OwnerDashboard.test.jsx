import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OwnerDashboard } from './OwnerDashboard';
import { appointments, owner, users } from '../../../test/fixtures';

const ownerServices = [
	{
		id: 'svc-1',
		name: 'Banho Completo',
		category: 'bath',
		duration: '60 min',
		price: 89.9,
		description: 'Banho com hidratação'
	},
	{
		id: 'svc-2',
		name: 'Vacina V10',
		category: 'vaccine',
		duration: '20 min',
		price: 129.9,
		description: 'Aplicação de vacina'
	}
];

describe('OwnerDashboard', () => {
	it('mostra metricas e permite cancelar agendamento selecionado', async () => {
		const user = userEvent.setup();
		const onCancelAppointment = vi.fn();

		render(
			<OwnerDashboard
				owner={owner}
				appointments={appointments}
				users={users}
				services={ownerServices}
				onAddService={vi.fn()}
				onDeleteService={vi.fn()}
				onCancelAppointment={onCancelAppointment}
				onLogout={vi.fn()}
			/>
		);

		expect(screen.getByText('Agendamentos do estabelecimento')).toBeInTheDocument();
		expect(screen.getByText('Total')).toBeInTheDocument();
		expect(screen.getByText('Agendados')).toBeInTheDocument();
		expect(screen.getAllByRole('button', { name: 'Ver detalhes' })).toHaveLength(2);

		await user.click(screen.getAllByRole('button', { name: 'Ver detalhes' })[0]);
		await user.click(screen.getByRole('button', { name: 'Cancelar agendamento' }));

		expect(onCancelAppointment).toHaveBeenCalledWith('apt-1');
	});

	it('troca para aba de cadastro de servicos', async () => {
		const user = userEvent.setup();

		render(
			<OwnerDashboard
				owner={owner}
				appointments={appointments}
				users={users}
				services={ownerServices}
				onAddService={vi.fn()}
				onDeleteService={vi.fn()}
				onCancelAppointment={vi.fn()}
				onLogout={vi.fn()}
			/>
		);

		await user.click(screen.getByRole('button', { name: 'Cadastro de servicos' }));
		expect(screen.getByText('Cadastrar servico / pacote')).toBeInTheDocument();
	});
});
