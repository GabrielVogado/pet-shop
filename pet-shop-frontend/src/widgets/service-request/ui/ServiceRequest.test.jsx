import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ServiceRequest } from './ServiceRequest';
import { services } from '../../../test/fixtures';

describe('ServiceRequest', () => {
	it('agenda um banho para o petshop selecionado', async () => {
		const user = userEvent.setup();
		const onSchedule = vi.fn();
		const onSelectPetshop = vi.fn();
		const onLoadAvailability = vi.fn().mockResolvedValue({
			availableDates: ['2026-07-10'],
			availableTimes: ['10:00']
		});

		render(
			<ServiceRequest
				pet={{ id: 'pet-1', name: 'Luna' }}
				services={services}
				petshops={[
					{ petshopId: 'petshop-1', businessName: 'Petshop 1' },
					{ petshopId: 'petshop-2', businessName: 'Petshop 2' }
				]}
				selectedPetshopId="petshop-1"
				onSelectPetshop={onSelectPetshop}
				onLoadAvailability={onLoadAvailability}
				onSchedule={onSchedule}
				realtimeEnabled={true}
			/>
		);

		expect(screen.getByText('Catalogo atualizado em tempo real')).toBeInTheDocument();
		await waitFor(() => expect(screen.getByRole('button', { name: 'Agendar' })).toBeEnabled());
		await user.click(screen.getByRole('button', { name: 'Agendar' }));

		expect(onSchedule).toHaveBeenCalledTimes(1);
		expect(onSchedule).toHaveBeenCalledWith(services.baths[0], 'petshop-1', '2026-07-10T10:00');
		expect(onLoadAvailability).toHaveBeenCalledWith('petshop-1', 'bath-1');
	});

	it('desabilita agendamento sem petshop selecionado', () => {
		const onSchedule = vi.fn();

		render(
			<ServiceRequest
				pet={{ id: 'pet-1', name: 'Luna' }}
				services={services}
				petshops={[{ petshopId: 'petshop-1', businessName: 'Petshop 1' }]}
				selectedPetshopId=""
				onSelectPetshop={vi.fn()}
				onLoadAvailability={vi.fn()}
				onSchedule={onSchedule}
			/>
		);

		expect(screen.getByRole('button', { name: 'Agendar' })).toBeDisabled();
	});

	it('auto seleciona petshop quando existe apenas um cadastrado', async () => {
		const onSelectPetshop = vi.fn();

		render(
			<ServiceRequest
				pet={{ id: 'pet-1', name: 'Luna' }}
				services={services}
				petshops={[{ petshopId: 'petshop-unico', name: 'AgroPet' }]}
				selectedPetshopId=""
				onSelectPetshop={onSelectPetshop}
				onLoadAvailability={vi.fn()}
				onSchedule={vi.fn()}
			/>
		);

		await waitFor(() => {
			expect(onSelectPetshop).toHaveBeenCalledWith('petshop-unico');
		});

		expect(screen.getByRole('option', { name: 'AgroPet' })).toBeInTheDocument();
		expect(screen.getByRole('combobox', { name: 'Petshop' })).toBeDisabled();
	});
});
