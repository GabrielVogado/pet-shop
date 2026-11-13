import React from 'react';
import { StatusBadge } from '../../../shared/ui/StatusBadge';
import { TableCell, TableHead } from '../../../shared/ui/Table';
import { formatDateTime } from '../../../shared/utils/dateTime';

export function ServiceHistory({ history, onCancelService }) {
	return (
		<section className="space-y-6">
			<div>
				<p className="text-sm font-semibold uppercase tracking-wide text-primary">Operacao</p>
				<h2 className="mt-1 text-2xl font-bold text-on-surface sm:text-3xl">Historico de servicos</h2>
			</div>

			<div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-lowest">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-outline-variant">
						<thead className="bg-primary-container/65">
							<tr>
								<TableHead>Data/Hora</TableHead>
								<TableHead>Tipo</TableHead>
								<TableHead>Servico</TableHead>
								<TableHead>Pet</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Acao</TableHead>
							</tr>
						</thead>
						<tbody className="divide-y divide-outline-variant">
							{history.length === 0 ? (
								<tr>
									<td className="px-4 py-8 text-center text-sm text-on-surface-variant" colSpan="6">
										Nenhum servico encontrado para este pet.
									</td>
								</tr>
							) : (
								history.map((item) => (
									<tr key={item.id} className="hover:bg-surface">
										<TableCell>{formatDateTime(item.dateTime ?? item.date)}</TableCell>
										<TableCell>{item.type}</TableCell>
										<TableCell>{item.service}</TableCell>
										<TableCell>{item.pet}</TableCell>
										<TableCell>
											<StatusBadge status={item.status} />
										</TableCell>
										<TableCell>
											{item.status === 'Agendado' ? (
												<button
													type="button"
													onClick={() => onCancelService(item.id)}
													className="min-h-9 rounded-xl bg-primary px-3 text-xs font-bold text-on-primary transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
												>
													Cancelar
												</button>
											) : (
												<span className="text-xs font-semibold text-on-surface-variant">Indisponivel</span>
											)}
										</TableCell>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}




