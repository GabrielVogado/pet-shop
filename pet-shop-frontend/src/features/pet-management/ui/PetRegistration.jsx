import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Field } from '../../../shared/ui/Field';

const initialPet = {
	name: '',
	species: 'Cachorro',
	breed: '',
	age: '',
	notes: ''
};

export function PetRegistration({ pets, activePet, onAddPet, onUpdatePet }) {
	const [isOpen, setIsOpen] = useState(pets.length === 0);
	const [form, setForm] = useState(initialPet);
	const [editForm, setEditForm] = useState(initialPet);
	const [editingPetId, setEditingPetId] = useState(null);

	function updateField(field, value) {
		setForm((current) => ({ ...current, [field]: value }));
	}

	function updateEditField(field, value) {
		setEditForm((current) => ({ ...current, [field]: value }));
	}

	function submitPet(event) {
		event.preventDefault();
		onAddPet(form);
		setForm(initialPet);
		setIsOpen(false);
	}

	function startEditing(pet) {
		setEditingPetId(pet.id);
		setEditForm({
			name: pet.name ?? '',
			species: pet.species ?? 'Cachorro',
			breed: pet.breed ?? '',
			age: pet.age ?? '',
			notes: pet.notes ?? ''
		});
	}

	function cancelEditing() {
		setEditingPetId(null);
		setEditForm(initialPet);
	}

	function submitEdit(event, pet) {
		event.preventDefault();
		if (!pet?.id || !onUpdatePet) {
			return;
		}

		onUpdatePet(pet.id, editForm);
		cancelEditing();
	}

	return (
		<section className="rounded-2xl border border-outline-variant bg-surface-lowest p-5">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-wide text-primary">Meus pets</p>
					<h2 className="mt-1 text-xl font-bold text-on-surface">
						{pets.length > 0 ? `${pets.length} pet(s) cadastrados` : 'Cadastre seu primeiro pet'}
					</h2>
				</div>
				<button
					type="button"
					onClick={() => setIsOpen((current) => !current)}
					className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-bold text-on-primary transition hover:bg-primary/90"
				>
					<Plus size={17} />
					Novo pet
				</button>
			</div>

			{isOpen && (
				<form className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5" onSubmit={submitPet}>
					<Field label="Nome" value={form.name} onChange={(value) => updateField('name', value)} />
					<label className="block">
						<span className="text-sm font-bold text-on-surface-variant">Especie</span>
						<select
							value={form.species}
							onChange={(event) => updateField('species', event.target.value)}
							className="mt-1 min-h-11 w-full rounded-xl border border-outline-variant bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
						>
							<option>Cachorro</option>
							<option>Gato</option>
							<option>Outro</option>
						</select>
					</label>
					<Field label="Raca" value={form.breed} onChange={(value) => updateField('breed', value)} />
					<Field label="Idade" value={form.age} onChange={(value) => updateField('age', value)} />
					<Field
						label="Observacoes"
						required={false}
						value={form.notes}
						onChange={(value) => updateField('notes', value)}
					/>
					<div className="md:col-span-2 xl:col-span-5">
						<button
							type="submit"
							className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-on-primary transition hover:bg-primary/90 sm:w-auto"
						>
							<Plus size={17} />
							Cadastrar pet
						</button>
					</div>
				</form>
			)}

			{activePet && (
				<div className="mt-6 space-y-4">
					<p className="text-sm font-semibold uppercase tracking-wide text-primary">Editar pet selecionado</p>
					{(() => {
						const pet = activePet;
						const isEditing = editingPetId === pet.id;

						return (
							<div key={pet.id} className="rounded-xl border border-outline-variant bg-surface p-4">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<div>
										<h3 className="font-bold text-on-surface">{pet.name}</h3>
										<p className="text-sm text-on-surface-variant">
											{pet.species} {pet.breed ? `| ${pet.breed}` : ''}
										</p>
									</div>
									{!isEditing && (
										<button
											type="button"
											onClick={() => startEditing(pet)}
											className="flex min-h-10 items-center justify-center rounded-xl bg-primary px-3 text-sm font-bold text-on-primary transition hover:bg-primary/90"
										>
											Editar dados
										</button>
									)}
								</div>

								{isEditing && (
									<form
										className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5"
										onSubmit={(event) => submitEdit(event, pet)}
									>
										<Field
											label="Nome"
											value={editForm.name}
											onChange={(value) => updateEditField('name', value)}
										/>
										<label className="block">
											<span className="text-sm font-bold text-on-surface-variant">Especie</span>
											<select
												value={editForm.species}
												onChange={(event) => updateEditField('species', event.target.value)}
												className="mt-1 min-h-11 w-full rounded-xl border border-outline-variant bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
											>
												<option>Cachorro</option>
												<option>Gato</option>
												<option>Outro</option>
											</select>
										</label>
										<Field
											label="Raca"
											value={editForm.breed}
											onChange={(value) => updateEditField('breed', value)}
										/>
										<Field
											label="Idade"
											value={editForm.age}
											onChange={(value) => updateEditField('age', value)}
										/>
										<Field
											label="Observacoes"
											required={false}
											value={editForm.notes}
											onChange={(value) => updateEditField('notes', value)}
										/>
										<div className="md:col-span-2 xl:col-span-5 flex gap-2">
											<button
												type="submit"
												className="flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-on-primary transition hover:bg-primary/90"
											>
												Salvar alteracoes
											</button>
											<button
												type="button"
												onClick={cancelEditing}
												className="flex min-h-11 items-center justify-center rounded-xl border border-outline-variant bg-surface-lowest px-4 text-sm font-bold text-on-surface-variant transition hover:bg-surface"
											>
												Cancelar
											</button>
										</div>
									</form>
								)}
							</div>
						);
					})()}
				</div>
			)}
		</section>
	);
}


