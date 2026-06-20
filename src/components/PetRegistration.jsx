import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const initialPet = {
  name: '',
  species: 'Cachorro',
  breed: '',
  age: '',
  notes: ''
};

export function PetRegistration({ pets, onAddPet }) {
  const [isOpen, setIsOpen] = useState(pets.length === 0);
  const [form, setForm] = useState(initialPet);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitPet(event) {
    event.preventDefault();
    onAddPet(form);
    setForm(initialPet);
    setIsOpen(false);
  }

  return (
    <section className="rounded-md border border-ink/10 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Meus pets</p>
          <h2 className="mt-1 text-xl font-bold text-ink">
            {pets.length > 0 ? `${pets.length} pet(s) cadastrados` : 'Cadastre seu primeiro pet'}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex min-h-10 items-center justify-center gap-2 rounded bg-ink px-3 text-sm font-bold text-white transition hover:bg-ink/90"
        >
          <Plus size={17} />
          Novo pet
        </button>
      </div>

      {isOpen && (
        <form className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5" onSubmit={submitPet}>
          <Field label="Nome" value={form.name} onChange={(value) => updateField('name', value)} />
          <label className="block">
            <span className="text-sm font-bold text-ink/70">Especie</span>
            <select
              value={form.species}
              onChange={(event) => updateField('species', event.target.value)}
              className="mt-1 min-h-11 w-full rounded border border-ink/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/15"
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
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded bg-coral px-4 text-sm font-bold text-white transition hover:bg-[#dc5848] sm:w-auto"
            >
              <Plus size={17} />
              Cadastrar pet
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function Field({ label, value, onChange, required = true }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-ink/70">{label}</span>
      <input
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 min-h-11 w-full rounded border border-ink/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/15"
      />
    </label>
  );
}
