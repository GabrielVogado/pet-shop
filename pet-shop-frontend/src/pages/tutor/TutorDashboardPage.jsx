import { CalendarPlus, History, ShieldCheck } from 'lucide-react';
import { AppShell } from '../../shared/ui/AppShell';
import { PetRegistration } from '../../features/pet-management/ui/PetRegistration';
import { ServiceHistory } from '../../features/scheduling/ui/ServiceHistory';
import { ServiceRequest } from '../../features/scheduling/ui/ServiceRequest';
import { VaccinationWallet } from '../../features/vaccination/ui/VaccinationWallet';

const tabs = [
  { id: 'request', label: 'Solicitar Servico', icon: CalendarPlus },
  { id: 'history', label: 'Historico de Servicos', icon: History },
  { id: 'wallet', label: 'Carteira de Vacinacao', icon: ShieldCheck }
];

export function TutorDashboardPage({
  tutor,
  activePet,
  pets,
  activeTab,
  notifications,
  petshops,
  selectedPetshopId,
  services,
  realtimeEnabled,
  petHistory,
  petVaccines,
  onTabChange,
  onPetChange,
  onLogout,
  onAddPet,
  onUpdatePet,
  onSelectPetshop,
  onLoadAvailability,
  onSchedule,
  onCancelService
}) {
  return (
    <AppShell
      tutor={tutor}
      activePet={activePet}
      pets={pets}
      tabs={tabs}
      activeTab={activeTab}
      activePetId={activePet?.id ?? null}
      notifications={notifications}
      onTabChange={onTabChange}
      onPetChange={onPetChange}
      onLogout={onLogout}
    >
      <PetRegistration pets={pets} activePet={activePet} onAddPet={onAddPet} onUpdatePet={onUpdatePet} />

      {activePet && activeTab === 'request' && (
        <ServiceRequest
          pet={activePet}
          services={services}
          petshops={petshops}
          selectedPetshopId={selectedPetshopId}
          onSelectPetshop={onSelectPetshop}
          onLoadAvailability={onLoadAvailability}
          onSchedule={onSchedule}
          realtimeEnabled={realtimeEnabled}
        />
      )}

      {activePet && activeTab === 'history' && (
        <ServiceHistory history={petHistory} onCancelService={onCancelService} />
      )}

      {activePet && activeTab === 'wallet' && (
        <VaccinationWallet pet={activePet} vaccinations={petVaccines} />
      )}
    </AppShell>
  );
}


