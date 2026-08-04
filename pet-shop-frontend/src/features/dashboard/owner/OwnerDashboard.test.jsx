import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OwnerDashboard } from './OwnerDashboard';

describe('OwnerDashboard', () => {
	it('abre detalhes ao clicar em "Ver detalhes" e exibe dados completos', async () => {
		const user = userEvent.setup();
		const appointments = [
			{
				id: 'ag-1',
				userId: 'u-1',
				tutor: 'Gabriel',
				tutorAddress: 'Q803 CJ 25 CS 20',
				tutorEmail: 'gabriel@email.com',
				tutorPhone: '61999990000',
				petId: 'p-1',
				pet: 'Loly',
				petSpecies: 'Cachorro',
				petBreed: 'SRD',
				petAge: '3',
				petNotes: 'Docil',
				dateTime: '2026-08-10T10:00:00',
				type: 'Banho',
				service: 'Banho + Tosa',
				status: 'Agendado'
			}
		];

		render(
			<OwnerDashboard
				owner={{ name: 'Owner' }}
				appointments={appointments}
				users={[]}
				services={[]}
				onAddService={vi.fn()}
				onDeleteService={vi.fn()}
				onCancelAppointment={vi.fn()}
				onLogout={vi.fn()}
			/>
		);

		expect(
			screen.getByText('Selecione um agendamento para ver os dados do cliente e do pet.')
		).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Ver detalhes' }));

		expect(screen.getByRole('heading', { name: 'Banho + Tosa' })).toBeInTheDocument();
		expect(screen.getByText('gabriel@email.com')).toBeInTheDocument();
		expect(screen.getByText('61999990000')).toBeInTheDocument();
		expect(screen.getByText('Cachorro')).toBeInTheDocument();
		expect(screen.getByText('SRD')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
	});
});
