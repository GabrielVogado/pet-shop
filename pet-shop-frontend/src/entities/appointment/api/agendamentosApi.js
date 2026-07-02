import { request } from '../../../shared/api/http';

export const agendamentosApi = {
  list: (petId) => request(`/api/agendamentos${petId ? `?petId=${encodeURIComponent(petId)}` : ''}`),
  availability: (petshopId, serviceId, date) => {
    const query = new URLSearchParams({ petshopId, serviceId });
    if (date) {
      query.set('date', date);
    }
    return request(`/api/agendamentos/availability?${query.toString()}`);
  },
  create: (payload) => request('/api/agendamentos', { method: 'POST', body: payload }),
  cancel: (id) => request(`/api/agendamentos/${encodeURIComponent(id)}/cancel`, { method: 'PUT' })
};
