import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { OwnerDashboard } from '../../features/dashboard/owner/OwnerDashboard';
import { servicosApi } from '../../features/service-catalog/api/servicosApi';
import { agendamentosApi } from '../../features/scheduling/api/agendamentosApi';

export function OwnerDashboardPage() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);

  const refresh = useCallback(async () => {
    const [a, s] = await Promise.all([
      agendamentosApi.list().catch(() => []),
      servicosApi.listOwn().catch(() => [])
    ]);
    setAppointments(a);
    setServices(s);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <OwnerDashboard owner={user} appointments={appointments} users={[]} services={services}
      onAddService={s => servicosApi.create(s).then(refresh)}
      onDeleteService={id => servicosApi.remove(id).then(refresh)}
      onCancelAppointment={id => agendamentosApi.cancel(id).then(refresh)}
      onLogout={logout} />
  );
}
