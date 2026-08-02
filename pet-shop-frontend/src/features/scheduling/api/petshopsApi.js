import { request } from '../../../shared/api/httpClient';

export const petshopsApi = {
  list: () => request('/api/petshops', { auth: false })
};



