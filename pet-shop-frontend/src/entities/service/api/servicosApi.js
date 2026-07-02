import { request } from '../../../shared/api/http';

export const servicosApi = {
  listOwn: () => request('/api/servicos'),
  create: (servico) => request('/api/servicos', { method: 'POST', body: servico }),
  remove: (id) => request(`/api/servicos/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  catalog: (petshopId) =>
    request(`/api/servicos/catalogo?petshopId=${encodeURIComponent(petshopId)}`, { auth: false })
};
