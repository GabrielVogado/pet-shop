import { agendamentosApi } from '../../entities/appointment/api/agendamentosApi';
import { notificationsApi } from '../../entities/notification/api/notificationsApi';
import { petsApi } from '../../entities/pet/api/petsApi';
import { petshopsApi } from '../../entities/petshop/api/petshopsApi';
import { servicosApi } from '../../entities/service/api/servicosApi';
import { authApi } from '../../entities/user/api/authApi';
import { clearToken, getToken, setToken } from './http';

export {
  agendamentosApi,
  authApi,
  clearToken,
  getToken,
  notificationsApi,
  petsApi,
  petshopsApi,
  servicosApi,
  setToken
};
