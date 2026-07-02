import { request } from '../../../shared/api/http';

export const petshopsApi = {
  list: () => request('/api/petshops', { auth: false })
};
