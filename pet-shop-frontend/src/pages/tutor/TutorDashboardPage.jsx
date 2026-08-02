import { useState, useEffect, useCallback } from 'react';
import { CalendarClock, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../shared/hooks/useAuth';
import { AppShell } from '../../shared/ui/AppShell';
import { PetRegistration } from '../../features/pet-management/ui/PetRegistration';
import { ServiceHistory } from '../../features/scheduling/ui/ServiceHistory';
import { ServiceRequest } from '../../features/scheduling/ui/ServiceRequest';
import { VaccinationWallet } from '../../features/vaccination/ui/VaccinationWallet';
import { petsApi } from '../../features/pet-management/api/petsApi';
import { servicosApi } from '../../features/service-catalog/api/servicosApi';
import { agendamentosApi } from '../../features/scheduling/api/agendamentosApi';
import { notificationsApi } from '../../features/notifications/api/notificationsApi';
import { useServiceCatalogStream } from '../../features/realtime/hooks/useCatalogStream';

const TABS = [
  { id: 'request', label: 'Solicitar Servico', icon: CalendarClock },
  { id: 'history', label: 'Historico', icon: Clock },
  { id: 'wallet', label: 'Vacinacao', icon: ShieldCheck }
];

export function TutorDashboardPage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('request');
  const [petId, setPetId] = useState(null);
  const [pets, setPets] = useState([]);
  const [petshopId, setPetshopId] = useState(null);
  const [services, setServices] = useState({ baths: [], vaccines: [] });
  const [history, setHistory] = useState([]);
  const [notifs, setNotifs] = useState([]);

  const pet = pets.find(p => p.id === petId) || null;

  const refreshPets = useCallback(async () => {
    const data = await petsApi.list();
    setPets(data);
    if (!petId && data.length) setPetId(data[0].id);
  }, [petId]);

  const refreshHistory = useCallback(async () => {
    const data = await agendamentosApi.list(petId);
    setHistory(data);
  }, [petId]);

  useEffect(() => {
    refreshPets();
    refreshHistory();
    notificationsApi.list().then(setNotifs).catch(() => {});
    // Auto-detect single petshop
    import('../../features/scheduling/api/petshopsApi').then(m =>
      m.petshopsApi.list().then(data => {
        if (data.length === 1) setPetshopId(data[0].petshopId);
      }).catch(() => {})
    );
  }, []);

  useEffect(() => {
    if (petshopId) servicosApi.catalog(petshopId).then(setServices).catch(() => {});
  }, [petshopId]);

  const onUpdate = useCallback((data) => {
    const cat = data.servico.category === 'bath' ? 'baths' : 'vaccines';
    if (data.action === 'ADDED') setServices(s => ({ ...s, [cat]: [...s[cat], data.servico] }));
    else setServices(s => ({ baths: s.baths.filter(x => x.id !== data.servico.id), vaccines: s.vaccines.filter(x => x.id !== data.servico.id) }));
  }, []);
  const realtime = useServiceCatalogStream(petshopId, onUpdate);

  return (
    <AppShell tutor={user} pets={pets} activePet={pet} tabs={TABS} activeTab={tab}
      activePetId={petId} notifications={notifs}
      onTabChange={setTab} onPetChange={setPetId} onLogout={logout}>
      <PetRegistration pets={pets} activePet={pet}
        onAddPet={p => petsApi.create(p).then(refreshPets)} onUpdatePet={(id, p) => petsApi.update(id, p).then(refreshPets)} />
      {pet && tab === 'request' && (
        <ServiceRequest pet={pet} services={services} petshops={petshopId ? [{ petshopId }] : []}
          selectedPetshopId={petshopId} onSelectPetshop={setPetshopId}
          onLoadAvailability={(pid, sid, d) => agendamentosApi.availability(pid, sid, d)}
          onSchedule={(s, pid, dt) => agendamentosApi.create({ petId: pet.id, petshopId: pid, serviceId: s.id, service: s.name, type: s.category === 'bath' ? 'Banho' : 'Vacina', dateTime: dt }).then(() => { refreshHistory(); setTab('history'); })}
          realtimeEnabled={realtime} />
      )}
      {pet && tab === 'history' && (
        <ServiceHistory history={history} onCancelService={id => agendamentosApi.cancel(id).then(refreshHistory)} />
      )}
      {pet && tab === 'wallet' && <VaccinationWallet pet={pet} vaccinations={[]} />}
    </AppShell>
  );
}
