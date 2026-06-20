import React from 'react';

const statusStyles = {
  Agendado: 'bg-mint text-ocean',
  Concluido: 'bg-ink text-white',
  Cancelado: 'bg-coral/15 text-coral'
};

export function ServiceHistory({ history, onCancelService }) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Operacao</p>
        <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Historico de servicos</h2>
      </div>

      <div className="overflow-hidden rounded-md border border-ink/10 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-ink/10">
            <thead className="bg-mint/65">
              <tr>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Servico</TableHead>
                <TableHead>Pet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Acao</TableHead>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {history.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-sm text-ink/55" colSpan="6">
                    Nenhum servico encontrado para este pet.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-paper">
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.service}</TableCell>
                    <TableCell>{item.pet}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex min-w-24 justify-center rounded px-3 py-1 text-xs font-bold ${
                          statusStyles[item.status] ?? 'bg-ink/10 text-ink'
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.status === 'Agendado' ? (
                        <button
                          type="button"
                          onClick={() => onCancelService(item.id)}
                          className="min-h-9 rounded bg-coral px-3 text-xs font-bold text-white transition hover:bg-[#dc5848] focus:outline-none focus:ring-2 focus:ring-coral focus:ring-offset-2"
                        >
                          Cancelar
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-ink/35">Indisponivel</span>
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

function TableHead({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink/65">
      {children}
    </th>
  );
}

function TableCell({ children }) {
  return <td className="whitespace-nowrap px-4 py-4 text-sm text-ink/75">{children}</td>;
}
