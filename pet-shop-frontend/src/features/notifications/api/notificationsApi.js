import { request } from '../../../shared/api/httpClientClient';

export const notificationsApi = {
  list: () => request('/api/notifications')
};



