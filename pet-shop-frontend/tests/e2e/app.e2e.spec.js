import { expect, test } from '@playwright/test';

async function fulfillJson(route, status, body) {
	await route.fulfill({
		status,
		contentType: 'application/json',
		body: JSON.stringify(body)
	});
}

test.beforeEach(async ({ page }) => {
	const tutorAppointments = [];
	const ownerAppointments = [
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
	];

	await page.route('http://localhost:8080/api/**', async (route) => {
		const request = route.request();
		const url = new URL(request.url());
		const { pathname, searchParams } = url;
		const method = request.method();
		const auth = await request.headerValue('authorization');
		const isOwner = auth === 'Bearer token-owner';

		if (method === 'GET' && pathname === '/api/petshops') {
			return fulfillJson(route, 200, [
				{ petshopId: 'petshop-central', businessName: 'Petshop Central' }
			]);
		}

		if (method === 'POST' && pathname === '/api/auth/register') {
			return fulfillJson(route, 200, { ok: true });
		}

		if (method === 'POST' && pathname === '/api/auth/login') {
			const payload = request.postDataJSON();
			if (payload.email === 'owner@example.com') {
				return fulfillJson(route, 200, {
					token: 'token-owner',
					user: {
						id: 'owner-1',
						name: 'Petshop Central',
						role: 'owner',
						petshopId: 'petshop-central'
					}
				});
			}

			return fulfillJson(route, 200, {
				token: 'token-tutor',
				user: { id: 'user-1', name: 'Ana Souza', role: 'tutor' }
			});
		}

		if (method === 'GET' && pathname === '/api/pets') {
			return fulfillJson(route, 200, [
				{ id: 'pet-1', name: 'Luna', species: 'Cachorro', breed: 'SRD', age: '4' }
			]);
		}

		if (method === 'GET' && pathname === '/api/notifications') {
			return fulfillJson(route, 200, []);
		}

		if (method === 'GET' && pathname === '/api/servicos/catalogo') {
			const petshopId = searchParams.get('petshopId');
			if (petshopId !== 'petshop-central') {
				return fulfillJson(route, 200, { baths: [], vaccines: [] });
			}

			return fulfillJson(route, 200, {
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
		}

		if (method === 'GET' && pathname === '/api/servicos') {
			return fulfillJson(route, 200, [
				{
					id: 'svc-1',
					name: 'Banho Completo',
					category: 'bath',
					duration: '60 min',
					price: 89.9
				}
			]);
		}

		if (method === 'GET' && pathname === '/api/agendamentos') {
			return fulfillJson(route, 200, isOwner ? ownerAppointments : tutorAppointments);
		}

		if (method === 'GET' && pathname === '/api/agendamentos/availability') {
			const date = searchParams.get('date');
			if (date) {
				return fulfillJson(route, 200, {
					availableDates: ['2026-07-10', '2026-07-11'],
					availableTimes: ['10:00', '10:30', '11:00']
				});
			}

			return fulfillJson(route, 200, {
				availableDates: ['2026-07-10', '2026-07-11'],
				availableTimes: ['10:00', '10:30', '11:00']
			});
		}

		if (method === 'POST' && pathname === '/api/agendamentos') {
			const payload = request.postDataJSON();
			const created = {
				id: 'ag-tutor-1',
				userId: 'user-1',
				petId: payload.petId,
				pet: 'Luna',
				type: payload.type,
				serviceId: payload.serviceId,
				service: payload.service,
				status: 'Agendado',
				dateTime: payload.dateTime,
				petshopId: payload.petshopId
			};
			tutorAppointments.unshift(created);
			return fulfillJson(route, 200, created);
		}

		if (method === 'PUT' && pathname === '/api/agendamentos/ag-owner-1/cancel') {
			ownerAppointments[0] = {
				...ownerAppointments[0],
				status: 'Cancelado'
			};
			return fulfillJson(route, 200, ownerAppointments[0]);
		}

		return fulfillJson(route, 404, { message: `Rota nao mockada: ${method} ${pathname}` });
	});
});

test('fluxo tutor: login e agendamento', async ({ page }) => {
	await page.goto('/');

	const emailInput = page.locator('input[type="email"]').first();
	const passwordInput = page.locator('input[type="password"]').first();

	await expect(emailInput).toBeVisible();
	await expect(passwordInput).toBeVisible();
	await emailInput.fill('ana@example.com');
	await passwordInput.fill('123456');
	await page.getByRole('button', { name: 'Entrar' }).click();

	await expect(page.getByText('Tutor: Ana Souza')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Agendar' })).toBeEnabled();

	await page.getByRole('button', { name: 'Agendar' }).click();

	await expect(page.getByRole('heading', { name: 'Historico de servicos' })).toBeVisible();
	await expect(page.getByText('Banho Completo')).toBeVisible();
});

test('fluxo owner: login e cancelamento de agendamento', async ({ page }) => {
	await page.goto('/');

	const emailInput = page.locator('input[type="email"]').first();
	const passwordInput = page.locator('input[type="password"]').first();

	await expect(emailInput).toBeVisible();
	await expect(passwordInput).toBeVisible();
	await emailInput.fill('owner@example.com');
	await passwordInput.fill('123456');
	await page.getByRole('button', { name: 'Entrar' }).click();

	await expect(page.getByRole('heading', { name: 'Dashboard do Petshop' })).toBeVisible();
	await page.getByRole('button', { name: 'Cancelar agendamento' }).click();
	await expect(page.getByRole('complementary').getByText('Cancelado')).toBeVisible();
});
