export function formatDateTime(value) {
	if (!value) {
		return 'Nao informado';
	}

	const normalized = typeof value === 'string' ? value.replace(' ', 'T') : value;
	const parsed = new Date(normalized);

	if (Number.isNaN(parsed.getTime())) {
		return value;
	}

	return new Intl.DateTimeFormat('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(parsed);
}
