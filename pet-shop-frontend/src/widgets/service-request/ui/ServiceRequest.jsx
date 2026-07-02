import React, { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Check, Store, Syringe, Waves } from 'lucide-react';

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
					setAvailabilityError('Nao foi possivel carregar agenda disponivel.');
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
					setAvailabilityError('Nao foi possivel carregar horarios disponiveis.');
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
					<p className="text-sm font-semibold uppercase tracking-wide text-ocean">Solicitacao</p>
					<h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">
						Escolha um servico para {pet.name}
					</h2>
				</div>

				{!noPetshops && (
					<div className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-bold text-ink/70">
						<Store size={16} className="text-ocean" />
						{activePetshopName}
					</div>
				)}

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

			{realtimeEnabled && (
				<div className="flex justify-end">
					<span className="inline-flex items-center gap-2 rounded-full bg-mint/40 px-3 py-1 text-xs font-bold text-ocean">
						<span className="h-2 w-2 rounded-full bg-green-500" />
						Catalogo atualizado em tempo real
					</span>
				</div>
			)}

			{!noPetshops && selectedService && (
				<section className="rounded-md border border-ink/10 bg-white p-4 shadow-soft">
					<div className="grid gap-4 md:grid-cols-2">
						<label className="block">
							<span className="text-sm font-bold text-ink/70">Dia disponivel</span>
							<select
								value={selectedDate}
								onChange={(event) => setSelectedDate(event.target.value)}
								disabled={loadingAvailability || availableDates.length === 0}
								className="mt-1 min-h-11 w-full rounded border border-ink/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/15 disabled:cursor-not-allowed disabled:bg-paper"
							>
								{availableDates.length === 0 ? (
									<option value="">Sem dias disponiveis</option>
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
							<span className="text-sm font-bold text-ink/70">Horario disponivel</span>
							<select
								value={selectedTime}
								onChange={(event) => setSelectedTime(event.target.value)}
								disabled={loadingAvailability || availableTimes.length === 0}
								className="mt-1 min-h-11 w-full rounded border border-ink/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-ocean focus:ring-2 focus:ring-ocean/15 disabled:cursor-not-allowed disabled:bg-paper"
							>
								{availableTimes.length === 0 ? (
									<option value="">Sem horarios disponiveis</option>
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
						<p className="mt-3 text-sm font-semibold text-coral">{availabilityError}</p>
					)}
				</section>
			)}

			{noPetshops && (
				<div className="rounded-md border border-ink/10 bg-white p-6 text-center text-sm text-ink/55 shadow-sm">
					Nenhum petshop disponivel no momento.
				</div>
			)}

			{!noPetshops && visibleServices.length === 0 && (
				<div className="rounded-md border border-ink/10 bg-white p-6 text-center text-sm text-ink/55 shadow-sm">
					Este petshop ainda nao cadastrou {serviceType === 'baths' ? 'banhos' : 'vacinas'}.
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
							className={`flex min-h-[320px] flex-col justify-between rounded-md border bg-white p-5 shadow-soft ${
								isSelectedService ? 'border-ocean/40' : 'border-ink/10'
							}`}
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
								onClick={() => handleSchedule(service)}
								disabled={!isSelectedService ? false : !canSchedule}
								className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded bg-coral px-4 text-sm font-bold text-white transition hover:bg-[#dc5848] focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/45"
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
