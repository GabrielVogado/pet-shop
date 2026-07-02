const statusStyles = {
  Agendado: 'bg-mint text-ocean',
  Concluido: 'bg-ink text-white',
  Cancelado: 'bg-coral/15 text-coral'
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex min-w-24 justify-center rounded px-3 py-1 text-xs font-bold ${
        statusStyles[status] ?? 'bg-ink/10 text-ink'
      }`}
    >
      {status}
    </span>
  );
}
