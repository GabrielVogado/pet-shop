import { OwnerDashboard } from '../../../widgets/owner-dashboard/ui/OwnerDashboard';

export function OwnerDashboardPage({
  owner,
  appointments,
  services,
  onAddService,
  onDeleteService,
  onCancelAppointment,
  onLogout
}) {
  return (
    <OwnerDashboard
      owner={owner}
      appointments={appointments}
      users={[]}
      services={services}
      onAddService={onAddService}
      onDeleteService={onDeleteService}
      onCancelAppointment={onCancelAppointment}
      onLogout={onLogout}
    />
  );
}
