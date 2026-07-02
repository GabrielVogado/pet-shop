import { request } from '../../../shared/api/http';

export const notificationsApi = {
  list: () => request('/api/notifications')
};
