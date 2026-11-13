import React, { useState } from 'react';
import { Plus, Syringe, Trash2, Waves } from 'lucide-react';
import { Field } from '../../../shared/ui/Field';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const initialForm = {
  name: '',
  category: 'bath',
  duration: '',
  price: '',
  description: '',
  features: ''
};

export function OwnerServices({ services, onAddService, onDeleteService }) {
  const [form, setForm] = useState(initialForm);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    const payload = {
      name: form.name.trim(),
      category: form.category,
      duration: form.duration.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      features: form.features
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    };
    await onAddService(payload);
    setForm(initialForm);
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-2xl border border-outline-variant bg-surface-lowest p-5">
        <h3 className="font-bold text-on-surface">Cadastrar servico / pacote</h3>
        <p className="mt-1 text-sm text-on-surface-variant">
          Os servicos ficam disponiveis para os tutores ao agendar nesta loja.
        </p>

        <form className="mt-4 space-y-4" onSubmit={submit}>
          <Field label="Nome" value={form.name} onChange={(v) => updateField('name', v)} />

          <label className="block">
            <span className="text-sm font-bold text-on-surface-variant">Categoria</span>
            <select
              value={form.category}
              onChange={(event) => updateField('category', event.target.value)}
              className="mt-1 min-h-11 w-full rounded-xl border border-outline-variant bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            >
              <option value="bath">Banho</option>
              <option value="vaccine">Vacina</option>
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Duracao"
              value={form.duration}
              placeholder="ex: 45 min"
              onChange={(v) => updateField('duration', v)}
            />
            <Field
              label="Preco (R$)"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(v) => updateField('price', v)}
            />
          </div>

          <Field
            label="Descricao"
            value={form.description}
            onChange={(v) => updateField('description', v)}
            required={false}
          />
          <Field
            label="Beneficios (separados por virgula)"
            value={form.features}
            placeholder="Shampoo neutro, Secagem"
            onChange={(v) => updateField('features', v)}
            required={false}
          />

          <button
            type="submit"
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-on-primary transition hover:bg-primary/90"
          >
            <Plus size={17} />
            Adicionar servico
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-outline-variant bg-surface-lowest p-5">
        <h3 className="font-bold text-on-surface">Servicos da loja ({services.length})</h3>
        {services.length === 0 ? (
          <p className="mt-3 text-sm text-on-surface-variant">
            Nenhum servico cadastrado ainda. Use o formulario ao lado.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {services.map((service) => (
              <li
                key={service.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-outline-variant bg-surface p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-primary-container text-primary">
                    {service.category === 'bath' ? <Waves size={18} /> : <Syringe size={18} />}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{service.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {service.category === 'bath' ? 'Banho' : 'Vacina'}
                      {service.duration ? ` | ${service.duration}` : ''} |{' '}
                      {currency.format(service.price)}
                    </p>
                    {service.description && (
                      <p className="mt-1 text-sm text-on-surface-variant">{service.description}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteService(service.id)}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-error/30 text-error transition hover:bg-error-container"
                  title="Remover servico"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}


