import { request } from '../../../shared/api/httpClientClient';

export const petshopsApi = {
  list: () => request('/api/petshops', { auth: false })
};



