export const owner = {
	id: 'owner-1',
	name: 'Petshop Central',
	petshopId: 'petshop-central'
};

export const users = [
	{
		id: 'user-1',
		name: 'Ana Souza',
		email: 'ana@example.com',
		phone: '(11) 99999-1111',
		address: 'Rua A, 100',
		pets: [
			{
				id: 'pet-1',
				name: 'Luna',
				species: 'Cachorro',
				breed: 'Vira-lata',
				age: '4',
				notes: 'Alergia leve'
			}
		]
	}
];

export const appointments = [
	{
		id: 'apt-1',
		userId: 'user-1',
		petId: 'pet-1',
		pet: 'Luna',
		type: 'Banho',
		service: 'Banho Completo',
		status: 'Agendado',
		dateTime: '2026-07-01 10:00',
		petshopId: 'petshop-central'
	},
	{
		id: 'apt-2',
		userId: 'user-1',
		petId: 'pet-1',
		pet: 'Luna',
		type: 'Vacina',
		service: 'V10',
		status: 'Concluido',
		dateTime: '2026-06-15 09:00',
		petshopId: 'petshop-central'
	}
];

export const services = {
	baths: [
		{
			id: 'bath-1',
			name: 'Banho Completo',
			duration: '60 min',
			price: 89.9,
			description: 'Banho com hidratação e escovação.',
			features: ['Hidratação', 'Escovação']
		}
	],
	vaccines: [
		{
			id: 'vac-1',
			name: 'Vacina V10',
			duration: '20 min',
			price: 129.9,
			description: 'Aplicação de vacina V10.',
			features: ['Carteira atualizada', 'Avaliação rápida']
		}
	]
};
