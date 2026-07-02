import { request } from '../../../shared/api/http';

export const petsApi = {
  list: () => request('/api/pets'),
  create: (pet) => request('/api/pets', { method: 'POST', body: pet }),
  update: (id, pet) => request(`/api/pets/${id}`, { method: 'PUT', body: pet })
};
