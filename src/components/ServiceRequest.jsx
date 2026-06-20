import React, { useState } from 'react';
import { CalendarClock, Check, Syringe, Waves } from 'lucide-react';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

export function ServiceRequest({ pet, services, onSchedule }) {
  const [serviceType, setServiceType] = useState('baths');
  const visibleServices = serviceType === 'baths' ? services.baths : services.vaccines;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Solicitacao</p>
          <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">
            Escolha um servico para {pet.name}
          </h2>
        </div>

        <div className="grid w-full grid-cols-2 rounded-md border border-ink/10 bg-white p-1 shadow-sm sm:w-auto">
          <button
            type="button"
            onClick={() => setServiceType('baths')}
            className={`flex min-h-11 items-center justify-center gap-2 rounded px-4 text-sm font-bold ${
              serviceType === 'baths' ? 'bg-ocean text-white' : 'text-ink/65 hover:bg-mint'
            }`}
          >
            <Waves size={17} />
            Banhos
          </button>
          <button
            type="button"
            onClick={() => setServiceType('vaccines')}
            className={`flex min-h-11 items-center justify-center gap-2 rounded px-4 text-sm font-bold ${
              serviceType === 'vaccines' ? 'bg-ocean text-white' : 'text-ink/65 hover:bg-mint'
            }`}
          >
            <Syringe size={17} />
            Vacinas
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleServices.map((service) => (
          <article
            key={service.id}
            className="flex min-h-[320px] flex-col justify-between rounded-md border border-ink/10 bg-white p-5 shadow-soft"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-ink">{service.name}</h3>
                  <p className="mt-1 text-sm text-ink/60">{service.duration}</p>
                </div>
                <span className="rounded bg-mint px-3 py-1 text-sm font-bold text-ocean">
                  {currency.format(service.price)}
                </span>
              </div>
              <p className="text-sm leading-6 text-ink/70">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-ink/70">
                    <Check size={16} className="text-coral" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onSchedule(service)}
              className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded bg-coral px-4 text-sm font-bold text-white transition hover:bg-[#dc5848] focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2"
            >
              <CalendarClock size={17} />
              Agendar
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
