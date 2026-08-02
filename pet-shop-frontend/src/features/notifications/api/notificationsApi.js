import { request } from '../../../shared/api/httpClient';

export const notificationsApi = {
  list: () => request('/api/notifications')
};



