import React from 'react';
import { Bell, LogOut, PawPrint } from 'lucide-react';

export function AppShell({
	tutor,
	activePet,
	pets,
	tabs,
	activeTab,
	activePetId,
	notifications = [],
	onTabChange,
	onPetChange,
	onLogout,
	children
}) {
	return (
		<div className="min-h-screen bg-paper">
			<header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/95 backdrop-blur">
				<div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex items-center gap-3">
							<div className="grid h-11 w-11 place-items-center rounded-md bg-coral text-white shadow-soft">
								<PawPrint size={23} />
							</div>
							<div>
								<h1 className="text-xl font-bold tracking-normal text-ink">PetCare Agenda</h1>
								<p className="text-sm text-ink/60">
									Tutor: <span className="font-semibold text-ink">{tutor.name}</span>
									{activePet ? ` | Pet ativo: ${activePet.name}` : ' | Cadastre seu primeiro pet'}
								</p>
							</div>
						</div>

						<button
							type="button"
							onClick={onLogout}
							className="flex min-h-10 items-center justify-center gap-2 rounded border border-ink/10 bg-white px-3 text-sm font-bold text-ink/70 transition hover:bg-mint hover:text-ink"
						>
							<LogOut size={17} />
							Sair
						</button>
					</div>

					{pets.length > 0 && (
						<div className="flex gap-2 overflow-x-auto rounded-md border border-ink/10 bg-white p-1 shadow-sm">
							{pets.map((pet) => {
								const isActive = activePetId === pet.id;

								return (
									<button
										key={pet.id}
										type="button"
										onClick={() => onPetChange(pet.id)}
										className={`flex min-h-10 shrink-0 items-center gap-2 rounded px-3 text-sm font-bold transition ${
											isActive ? 'bg-ocean text-white' : 'text-ink/65 hover:bg-mint hover:text-ink'
										}`}
									>
										<PawPrint size={16} />
										{pet.name}
									</button>
								);
							})}
						</div>
					)}

					<nav className="flex gap-2 overflow-x-auto rounded-md border border-ink/10 bg-white p-1 shadow-sm">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							const isActive = activeTab === tab.id;

							return (
								<button
									key={tab.id}
									type="button"
									onClick={() => onTabChange(tab.id)}
									disabled={!activePet}
									className={`flex min-h-10 shrink-0 items-center gap-2 rounded px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${
										isActive
											? 'bg-ink text-white'
											: 'text-ink/65 hover:bg-mint hover:text-ink'
									}`}
								>
									<Icon size={17} />
									<span>{tab.label}</span>
								</button>
							);
						})}
					</nav>
				</div>
			</header>

			<main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
				{notifications.length > 0 && (
					<section className="rounded-md border border-coral/20 bg-white p-4 shadow-soft">
						<div className="flex items-center gap-2">
							<Bell size={18} className="text-coral" />
							<h2 className="font-bold text-ink">Notificacoes do petshop</h2>
						</div>
						<div className="mt-3 space-y-2">
							{notifications.slice(0, 3).map((notification) => (
								<article key={notification.id} className="rounded border border-ink/10 bg-paper p-3">
									<p className="text-sm font-bold text-ink">{notification.title}</p>
									<p className="mt-1 text-sm text-ink/65">{notification.message}</p>
									<p className="mt-1 text-xs font-semibold text-ink/45">{notification.createdAt}</p>
								</article>
							))}
						</div>
					</section>
				)}
				{children}
			</main>
		</div>
	);
}
