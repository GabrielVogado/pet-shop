import React, { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Check, Loader2, Store, Syringe, Waves } from 'lucide-react';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

export function ServiceRequest({
  pet,
  services,
  petshops = [],
  selectedPetshopId,
  onSelectPetshop,
  onLoadAvailability,
  onSchedule,
  realtimeEnabled = false
}) {
  const [serviceType, setServiceType] = useState('baths');
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');

  const visibleServices = useMemo(
    () => (serviceType === 'baths' ? services.baths : services.vaccines) ?? [],
    [serviceType, services]
  );
  const selectedService = visibleServices.find((service) => service.id === selectedServiceId) ?? null;
  const activePetshopId = selectedPetshopId || petshops[0]?.petshopId || null;
  const activePetshopName =
    petshops[0]?.name ?? petshops[0]?.businessName ?? petshops[0]?.petshopId ?? 'Petshop';

  const noPetshops = petshops.length === 0;

  useEffect(() => {
    if (activePetshopId && activePetshopId !== selectedPetshopId) {
      onSelectPetshop(petshops[0].petshopId);
    }
  }, [activePetshopId, petshops, selectedPetshopId, onSelectPetshop]);

  useEffect(() => {
    if (!visibleServices.length) {
      setSelectedServiceId(null);
      return;
    }

    setSelectedServiceId((current) =>
      visibleServices.some((service) => service.id === current) ? current : visibleServices[0].id
    );
  }, [visibleServices]);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialAvailability() {
      if (!activePetshopId || !selectedServiceId || !onLoadAvailability) {
        setAvailableDates([]);
        setAvailableTimes([]);
        setSelectedDate('');
        setSelectedTime('');
        return;
      }

      setLoadingAvailability(true);
      setAvailabilityError('');
      try {
        const data = await onLoadAvailability(activePetshopId, selectedServiceId);
        if (cancelled) {
          return;
        }
        const nextDates = data?.availableDates ?? [];
        const nextTimes = data?.availableTimes ?? [];
        setAvailableDates(nextDates);
        setSelectedDate(nextDates[0] ?? '');
        setAvailableTimes(nextTimes);
        setSelectedTime(nextTimes[0] ?? '');
      } catch {
        if (!cancelled) {
          setAvailabilityError('Não foi possível carregar agenda disponível.');
          setAvailableDates([]);
          setAvailableTimes([]);
          setSelectedDate('');
          setSelectedTime('');
        }
      } finally {
        if (!cancelled) {
          setLoadingAvailability(false);
        }
      }
    }

    loadInitialAvailability();

    return () => {
      cancelled = true;
    };
  }, [activePetshopId, selectedServiceId, onLoadAvailability]);

  useEffect(() => {
    let cancelled = false;

    async function loadTimesForDate() {
      if (!selectedDate || !activePetshopId || !selectedServiceId || !onLoadAvailability) {
        return;
      }

      setLoadingAvailability(true);
      setAvailabilityError('');
      try {
        const data = await onLoadAvailability(activePetshopId, selectedServiceId, selectedDate);
        if (cancelled) {
          return;
        }
        const nextTimes = data?.availableTimes ?? [];
        setAvailableTimes(nextTimes);
        setSelectedTime((current) => (nextTimes.includes(current) ? current : nextTimes[0] ?? ''));
      } catch {
        if (!cancelled) {
          setAvailabilityError('Não foi possível carregar horários disponíveis.');
          setAvailableTimes([]);
          setSelectedTime('');
        }
      } finally {
        if (!cancelled) {
          setLoadingAvailability(false);
        }
      }
    }

    loadTimesForDate();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, activePetshopId, selectedServiceId, onLoadAvailability]);

  function handleSchedule(service) {
    if (service.id !== selectedServiceId) {
      setSelectedServiceId(service.id);
      return;
    }

    if (!selectedDate || !selectedTime) {
      return;
    }

    onSchedule(service, activePetshopId, `${selectedDate}T${selectedTime}`);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Solicitação</p>
          <h2 className="mt-1 text-2xl font-bold text-on-surface sm:text-3xl">
            Escolha um serviço para {pet.name}
          </h2>
        </div>

        {!noPetshops && (
          <div className="inline-flex items-center gap-2 rounded-2xl border border-outline-variant bg-surface-lowest px-3 py-2 text-sm font-bold text-on-surface-variant">
            <Store size={16} className="text-primary" />
            {activePetshopName}
          </div>
        )}

        <div className="grid w-full grid-cols-2 rounded-2xl border border-outline-variant bg-surface-lowest p-1 sm:w-auto">
          <button
            type="button"
            onClick={() => setServiceType('baths')}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              serviceType === 'baths' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-primary-container'
            }`}
          >
            <Waves size={17} />
            Banhos
          </button>
          <button
            type="button"
            onClick={() => setServiceType('vaccines')}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              serviceType === 'vaccines' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-primary-container'
            }`}
          >
            <Syringe size={17} />
            Vacinas
          </button>
        </div>
      </div>

      {realtimeEnabled && (
        <div className="flex justify-end">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-container/40 px-3 py-1 text-xs font-bold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Catálogo atualizado em tempo real
          </span>
        </div>
      )}

      {!noPetshops && selectedService && (
        <section className="rounded-2xl border border-outline-variant bg-surface-lowest p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-on-surface-variant">Dia disponível</span>
              <select
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                disabled={loadingAvailability || availableDates.length === 0}
                className="mt-1 min-h-11 w-full rounded-xl border border-outline-variant bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-surface"
              >
                {availableDates.length === 0 ? (
                  <option value="">Sem dias disponíveis</option>
                ) : (
                  availableDates.map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))
                )}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-on-surface-variant">Horário disponível</span>
              <select
                value={selectedTime}
                onChange={(event) => setSelectedTime(event.target.value)}
                disabled={loadingAvailability || availableTimes.length === 0}
                className="mt-1 min-h-11 w-full rounded-xl border border-outline-variant bg-surface-lowest px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-surface"
              >
                {availableTimes.length === 0 ? (
                  <option value="">Sem horários disponíveis</option>
                ) : (
                  availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))
                )}
              </select>
            </label>
          </div>

          {availabilityError && (
            <p className="mt-3 text-sm font-semibold text-error" role="alert">{availabilityError}</p>
          )}
        </section>
      )}

      {noPetshops && (
        <div className="rounded-2xl border border-outline-variant bg-surface-lowest p-6 text-center text-sm text-on-surface-variant">
          Nenhum petshop disponível no momento.
        </div>
      )}

      {!noPetshops && visibleServices.length === 0 && (
        <div className="rounded-2xl border border-outline-variant bg-surface-lowest p-6 text-center text-sm text-on-surface-variant">
          Este petshop ainda não cadastrou {serviceType === 'baths' ? 'banhos' : 'vacinas'}.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleServices.map((service) => {
          const isSelectedService = service.id === selectedServiceId;
          const canSchedule =
            isSelectedService && !!activePetshopId && !!selectedDate && !!selectedTime && !noPetshops;

          return (
            <article
              key={service.id}
              className={`flex min-h-[320px] flex-col justify-between rounded-2xl border bg-surface-lowest p-5 ${
                isSelectedService ? 'border-primary/40' : 'border-outline-variant'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">{service.name}</h3>
                    <p className="mt-1 text-sm text-on-surface-variant">{service.duration}</p>
                  </div>
                  <span className="rounded-xl bg-primary-container px-3 py-1 text-sm font-bold text-primary">
                    {currency.format(service.price)}
                  </span>
                </div>
                <p className="text-sm leading-6 text-on-surface-variant">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Check size={16} className="text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSchedule(service)}
                disabled={!isSelectedService ? false : !canSchedule}
                className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-on-primary transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-surface-highest disabled:text-on-surface-variant"
              >
                <CalendarClock size={17} />
                {isSelectedService ? 'Agendar' : 'Selecionar'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}