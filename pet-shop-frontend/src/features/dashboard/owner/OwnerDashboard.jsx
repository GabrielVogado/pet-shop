import React, { useMemo, useState } from 'react';
import {
	CalendarCheck,
	LogOut,
	PawPrint,
	ShieldCheck,
	Store,
	Syringe,
	User,
	Waves
} from 'lucide-react';
import { OwnerServices } from '../../service-catalog/ui/OwnerServices';
import { formatDateTime } from '../../../shared/utils/dateTime';

export function OwnerDashboard({
	owner,
	appointments,
	users,
	services,
	onAddService,
	onDeleteService,
	onCancelAppointment,
	onLogout
}) {
	const [selectedAppointmentId, setSelectedAppointmentId] = useState(appointments[0]?.id ?? null);
	const [activeTab, setActiveTab] = useState('appointments');

	useEffect(() => {
		if (!selectedAppointmentId) {
			return;
		}

		const exists = appointments.some((appointment) => appointment.id === selectedAppointmentId);
		if (!exists) {
			setSelectedAppointmentId(null);
		}
	}, [appointments, selectedAppointmentId]);

	const metrics = useMemo(() => {
		return {
			total: appointments.length,
			scheduled: appointments.filter((item) => item.status === 'Agendado').length,
			baths: appointments.filter((item) => item.type === 'Banho').length,
			vaccines: appointments.filter((item) => item.type === 'Vacina').length
		};
	}, [appointments]);

	const selectedAppointment =
		appointments.find((appointment) => appointment.id === selectedAppointmentId) ?? null;
	const selectedTutor = selectedAppointment
		? users.find((user) => user.id === selectedAppointment.userId)
		: null;
	const selectedPet = selectedAppointment
		? {
				id: selectedAppointment.petId,
				name: selectedAppointment.pet,
				species: selectedAppointment.petSpecies,
				breed: selectedAppointment.petBreed,
				age: selectedAppointment.petAge,
				notes: selectedAppointment.petNotes
			}
		: null;

	function getTutorName(appointment) {
		return (
			users.find((user) => user.id === appointment.userId)?.name ??
			appointment.tutor ??
			'Tutor nao identificado'
		);
	}

	function handleCancel() {
		if (!selectedAppointment) {
			return;
		}

		onCancelAppointment(selectedAppointment.id);
	}

	return (
		<div className="min-h-screen bg-surface">
			<header className="border-b border-outline-variant bg-surface-lowest">
				<div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
					<div className="flex items-center gap-3">
						<div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-on-primary">
							<Store size={22} />
						</div>
						<div>
							<h1 className="text-xl font-bold text-on-surface">Dashboard do Petshop</h1>
							<p className="text-sm text-on-surface-variant">
								Dono: <span className="font-semibold text-on-surface">{owner.name}</span>
							</p>
						</div>
					</div>

					<button
						type="button"
						onClick={onLogout}
						className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-lowest px-3 text-sm font-bold text-on-surface-variant transition hover:bg-primary-container hover:text-on-surface"
					>
						<LogOut size={17} />
						Sair
					</button>
				</div>
			</header>

			<main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
				<section className="grid w-full grid-cols-2 rounded-2xl border border-outline-variant bg-surface-lowest p-1 md:w-[520px]">
					<button
						type="button"
						onClick={() => setActiveTab('appointments')}
						className={`flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-bold ${
							activeTab === 'appointments' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-primary-container'
						}`}
					>
						Servicos agendados
					</button>
					<button
						type="button"
						onClick={() => setActiveTab('services')}
						className={`flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-bold ${
							activeTab === 'services' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-primary-container'
						}`}
					>
						Cadastro de servicos
					</button>
				</section>

				<section>
					<p className="text-sm font-semibold uppercase tracking-wide text-primary">Visao de negocios</p>
					<h2 className="mt-1 text-2xl font-bold text-on-surface sm:text-3xl">
						Agendamentos do estabelecimento
					</h2>
				</section>

				<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<MetricCard icon={CalendarCheck} label="Total" value={metrics.total} />
					<MetricCard icon={ShieldCheck} label="Agendados" value={metrics.scheduled} />
					<MetricCard icon={Waves} label="Banhos" value={metrics.baths} />
					<MetricCard icon={Syringe} label="Vacinas" value={metrics.vaccines} />
				</section>

				{activeTab === 'services' && (
					<OwnerServices
						services={services}
						onAddService={onAddService}
						onDeleteService={onDeleteService}
					/>
				)}

				{activeTab === 'appointments' && (
					<section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
						<div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-lowest">
							<div className="border-b border-outline-variant px-5 py-4">
								<h3 className="font-bold text-on-surface">Agenda recebida</h3>
								<p className="mt-1 text-sm text-on-surface-variant">
									Somente agendamentos vinculados ao petshop deste usuario owner.
								</p>
							</div>

							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-outline-variant">
									<thead className="bg-primary-container/65">
										<tr>
											<TableHead>Data/Hora</TableHead>
											<TableHead>Servico</TableHead>
											<TableHead>Nome do Tutor</TableHead>
											<TableHead>Nome do Pet</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Acao</TableHead>
										</tr>
									</thead>
									<tbody className="divide-y divide-outline-variant">
										{appointments.length === 0 ? (
											<tr>
												<td className="px-4 py-8 text-center text-sm text-on-surface-variant" colSpan="6">
													Nenhum agendamento encontrado para este petshop.
												</td>
											</tr>
										) : (
											appointments.map((appointment) => {
												const isSelected = selectedAppointment?.id === appointment.id;

												return (
													<tr
														key={appointment.id}
														className={isSelected ? 'bg-primary-container/40' : 'hover:bg-surface'}
													>
														<TableCell>{formatDateTime(appointment.dateTime ?? appointment.date)}</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																{appointment.type === 'Banho' ? (
																	<Waves size={16} className="text-primary" />
																) : (
																	<Syringe size={16} className="text-primary" />
																)}
																<span>
																	{appointment.type} | {appointment.service}
																</span>
															</div>
														</TableCell>
														<TableCell>{getTutorName(appointment)}</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																<PawPrint size={16} className="text-primary" />
																{appointment.pet}
															</div>
														</TableCell>
														<TableCell>
															<StatusBadge status={appointment.status} />
														</TableCell>
														<TableCell>
															<button
																type="button"
																onClick={() => setSelectedAppointmentId(appointment.id)}
																className="min-h-9 rounded-xl bg-primary px-3 text-xs font-bold text-on-primary transition hover:bg-primary/90"
															>
																Ver detalhes
															</button>
														</TableCell>
													</tr>
												);
											})
										)}
									</tbody>
								</table>
							</div>
						</div>

						<AppointmentDetails
							appointment={selectedAppointment}
							tutor={selectedTutor}
							pet={selectedPet}
							onCancel={handleCancel}
						/>
					</section>
				)}
			</main>
		</div>
	);
}

function AppointmentDetails({ appointment, tutor, pet, onCancel }) {
	if (!appointment) {
		return (
			<aside className="rounded-2xl border border-outline-variant bg-surface-lowest p-5 text-sm text-on-surface-variant">
				Selecione um agendamento para ver os dados do cliente e do pet.
			</aside>
		);
	}

	return (
		<aside className="space-y-4 rounded-2xl border border-outline-variant bg-surface-lowest p-5">
			<div>
				<p className="text-sm font-semibold uppercase tracking-wide text-primary">Detalhes</p>
				<h3 className="mt-1 text-xl font-bold text-on-surface">{appointment.service}</h3>
				<div className="mt-3">
					<StatusBadge status={appointment.status} />
				</div>
			</div>

			<InfoGroup icon={CalendarCheck} title="Agendamento">
				<InfoLine label="Data/Hora" value={formatDateTime(appointment.dateTime ?? appointment.date)} />
				<InfoLine label="Tipo" value={appointment.type} />
			</InfoGroup>

			<InfoGroup icon={User} title="Cliente">
				<InfoLine label="Nome" value={tutor?.name ?? appointment.tutor} />
				<InfoLine
					label="Endereco"
					value={appointment.tutorAddress ?? tutor?.address ?? 'Nao informado'}
				/>
				<InfoLine label="Email" value={appointment.tutorEmail ?? tutor?.email ?? 'Nao informado'} />
				<InfoLine label="Telefone" value={appointment.tutorPhone ?? tutor?.phone ?? 'Nao informado'} />
			</InfoGroup>

			<InfoGroup icon={PawPrint} title="Pet">
				<InfoLine label="Nome" value={pet?.name ?? appointment.pet} />
				<InfoLine label="Especie" value={pet?.species ?? 'Nao informado'} />
				<InfoLine label="Raca" value={pet?.breed ?? 'Nao informado'} />
				<InfoLine label="Idade" value={pet?.age ?? 'Nao informado'} />
				<InfoLine label="Observacoes" value={pet?.notes || 'Sem observacoes'} />
			</InfoGroup>

			<button
				type="button"
				onClick={onCancel}
				disabled={appointment.status !== 'Agendado'}
				className="flex min-h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-on-primary transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-surface-highest disabled:text-on-surface-variant"
			>
				Cancelar agendamento
			</button>
		</aside>
	);
}

function MetricCard({ icon: Icon, label, value }) {
	return (
		<article className="rounded-2xl border border-outline-variant bg-surface-lowest p-5">
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="text-sm font-semibold text-on-surface-variant">{label}</p>
					<p className="mt-2 text-3xl font-bold text-on-surface">{value}</p>
				</div>
				<div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-container text-primary">
					<Icon size={21} />
				</div>
			</div>
		</article>
	);
}

function InfoGroup({ icon: Icon, title, children }) {
	return (
		<section className="rounded-xl border border-outline-variant bg-surface p-4">
			<div className="flex items-center gap-2">
				<Icon size={17} className="text-primary" />
				<h4 className="font-bold text-on-surface">{title}</h4>
			</div>
			<dl className="mt-3 space-y-2">{children}</dl>
		</section>
	);
}

function InfoLine({ label, value }) {
	return (
		<div>
			<dt className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</dt>
			<dd className="break-words text-sm font-semibold text-on-surface-variant">{value}</dd>
		</div>
	);
}

function StatusBadge({ status }) {
	const styles = {
		Agendado: 'bg-primary-container text-on-primary-container',
		Concluido: 'bg-surface-highest text-on-surface-variant',
		Cancelado: 'bg-error-container text-on-error-container'
	};

	return (
		<span
			className={`inline-flex min-w-24 justify-center rounded-xl px-3 py-1 text-xs font-bold ${
				styles[status] ?? 'bg-surface-highest text-on-surface'
			}`}
		>
			{status}
		</span>
	);
}

function TableHead({ children }) {
	return (
		<th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-on-surface-variant">
			{children}
		</th>
	);
}

function TableCell({ children }) {
	return <td className="whitespace-nowrap px-4 py-4 text-sm text-on-surface-variant">{children}</td>;
}



