import React from 'react';
import { BadgeCheck, CalendarDays, Hash, Stethoscope } from 'lucide-react';

export function VaccinationWallet({ pet, vaccinations }) {
	return (
		<section className="space-y-6">
			<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-wide text-ocean">Saude</p>
					<h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Carteira de vacinacao</h2>
				</div>
				<div className="rounded-md border border-ink/10 bg-white px-4 py-3 text-sm text-ink/70 shadow-sm">
					Pet: <span className="font-bold text-ink">{pet.name}</span> | {pet.species} | {pet.age}
				</div>
			</div>

			{vaccinations.length === 0 ? (
				<div className="rounded-md border border-ink/10 bg-white p-8 text-center shadow-soft">
					<h3 className="font-bold text-ink">Nenhuma vacina registrada</h3>
					<p className="mt-1 text-sm text-ink/60">
						As vacinas aplicadas para {pet.name} aparecerao aqui.
					</p>
				</div>
			) : (
				<div className="grid gap-4 lg:grid-cols-3">
					{vaccinations.map((vaccine) => (
						<article
							key={vaccine.id}
							className="rounded-md border border-ink/10 bg-white p-5 shadow-soft"
						>
							<div className="flex items-center gap-3 border-b border-ink/10 pb-4">
								<div className="grid h-11 w-11 place-items-center rounded bg-ocean text-white">
									<BadgeCheck size={22} />
								</div>
								<div>
									<h3 className="font-bold text-ink">{vaccine.name}</h3>
									<p className="text-sm text-ink/60">Aplicada com registro</p>
								</div>
							</div>

							<dl className="mt-4 space-y-3">
								<WalletRow icon={CalendarDays} label="Aplicacao" value={vaccine.appliedAt} />
								<WalletRow icon={CalendarDays} label="Proxima dose" value={vaccine.nextDose} />
								<WalletRow icon={Hash} label="Lote" value={vaccine.batch} />
								<WalletRow icon={Stethoscope} label="Veterinario" value={vaccine.veterinarian} />
							</dl>
						</article>
					))}
				</div>
			)}
		</section>
	);
}

function WalletRow({ icon: Icon, label, value }) {
	return (
		<div className="flex items-start gap-3">
			<Icon size={17} className="mt-0.5 text-coral" />
			<div>
				<dt className="text-xs font-bold uppercase tracking-wide text-ink/45">{label}</dt>
				<dd className="text-sm font-semibold text-ink/80">{value}</dd>
			</div>
		</div>
	);
}
