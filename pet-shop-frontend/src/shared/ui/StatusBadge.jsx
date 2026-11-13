const statusStyles = {
  Agendado: 'bg-primary-container text-on-primary-container',
  Concluido: 'bg-surface-highest text-on-surface-variant',
  Cancelado: 'bg-error-container text-on-error-container'
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex min-w-24 justify-center rounded-xl px-3 py-1 text-xs font-bold ${
        statusStyles[status] ?? 'bg-surface-highest text-on-surface'
      }`}
    >
      {status}
    </span>
  );
}
