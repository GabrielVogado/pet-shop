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
		<div className="min-h-screen bg-surface">
			<header className="sticky top-0 z-20 border-b border-outline-variant bg-surface/95 backdrop-blur">
				<div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
						<div className="flex items-center gap-3">
							<img src="/pertim-simbolo.svg" alt="" className="h-11 w-11" />
							<div>
								<h1 className="text-xl font-bold tracking-normal text-on-surface">Pertim</h1>
								<p className="text-sm text-on-surface-variant">
									Tutor: <span className="font-semibold text-on-surface">{tutor.name}</span>
									{activePet ? ` | Pet ativo: ${activePet.name}` : ' | Cadastre seu primeiro pet'}
								</p>
							</div>
						</div>

						<button
							type="button"
							onClick={onLogout}
							className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-lowest px-3 text-sm font-bold text-on-surface-variant transition hover:bg-primary-container hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
						>
							<LogOut size={17} />
							Sair
						</button>
					</div>

					{pets.length > 0 && (
						<div className="flex gap-2 overflow-x-auto rounded-2xl border border-outline-variant bg-surface-lowest p-1">
							{pets.map((pet) => {
								const isActive = activePetId === pet.id;

								return (
									<button
										key={pet.id}
										type="button"
										onClick={() => onPetChange(pet.id)}
										className={`flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
											isActive ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-primary-container hover:text-on-surface'
										}`}
									>
										<PawPrint size={16} />
										{pet.name}
									</button>
								);
							})}
						</div>
					)}

					<nav className="flex gap-2 overflow-x-auto rounded-2xl border border-outline-variant bg-surface-lowest p-1">
						{tabs.map((tab) => {
							const Icon = tab.icon || PawPrint;
							const isActive = activeTab === tab.id;

							return (
								<button
									key={tab.id}
									type="button"
									onClick={() => onTabChange(tab.id)}
									disabled={!activePet}
									className={`flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
										isActive
											? 'bg-primary text-on-primary'
											: 'text-on-surface-variant hover:bg-primary-container hover:text-on-surface'
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
					<section className="rounded-2xl border border-primary/20 bg-surface-lowest p-4" role="region" aria-label="Notificações do petshop">
						<div className="flex items-center gap-2">
							<Bell size={18} className="text-primary" aria-hidden="true" />
							<h2 className="font-bold text-on-surface">Notificações do petshop</h2>
						</div>
						<div className="mt-3 space-y-2">
							{notifications.slice(0, 3).map((notification) => (
								<article key={notification.id} className="rounded-xl border border-outline-variant bg-surface p-3">
									<p className="text-sm font-bold text-on-surface">{notification.title}</p>
									<p className="mt-1 text-sm text-on-surface-variant">{notification.message}</p>
									<p className="mt-1 text-xs font-semibold text-on-surface-variant">{notification.createdAt}</p>
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