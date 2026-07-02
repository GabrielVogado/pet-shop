import React, { useEffect, useMemo, useState } from 'react';
import { AuthPage } from '../pages/auth/ui/AuthPage';
import { OwnerDashboardPage } from '../pages/owner-dashboard/ui/OwnerDashboardPage';
import { TutorDashboardPage } from '../pages/tutor-dashboard/ui/TutorDashboardPage';
import { useServiceCatalogStream } from '../features/service-catalog-stream/model/useServiceCatalogStream';
import {
  agendamentosApi,
  authApi,
  clearToken,
  notificationsApi,
  petsApi,
  petshopsApi,
  servicosApi,
  setToken
} from '../shared/api';

export function App() {
  const [sessionUser, setSessionUser] = useState(null);
  const [activeTab, setActiveTab] = useState('request');
  const [activePetId, setActivePetId] = useState(null);
  const [pets, setPets] = useState([]);
  const [history, setHistory] = useState([]);
  const [vaccinationRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [petshops, setPetshops] = useState([]);
  const [selectedPetshopId, setSelectedPetshopId] = useState(null);
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);
  const [catalogServices, setCatalogServices] = useState({ baths: [], vaccines: [] });
  const [ownerServices, setOwnerServices] = useState([]);

  useEffect(() => {
    petshopsApi
      .list()
      .then((data) => {
        const singlePetshop = Array.isArray(data) && data.length > 0 ? [data[0]] : [];
        setPetshops(singlePetshop);
        setSelectedPetshopId(singlePetshop[0]?.petshopId ?? null);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!sessionUser) {
      setPets([]);
      setHistory([]);
      setNotifications([]);
      setOwnerServices([]);
      return;
    }

    if (sessionUser.role === 'tutor') {
      petsApi
        .list()
        .then((data) => {
          setPets(data);
          setActivePetId((current) =>
            current && data.some((pet) => pet.id === current) ? current : data[0]?.id ?? null
          );
        })
        .catch(() => {
          setPets([]);
          setActivePetId(null);
        });

      agendamentosApi
        .list()
        .then((data) => setHistory(data))
        .catch(() => setHistory([]));

      notificationsApi
        .list()
        .then((data) => setNotifications(data))
        .catch(() => setNotifications([]));

      return;
    }

    agendamentosApi
      .list()
      .then((data) => setHistory(data))
      .catch(() => setHistory([]));

    servicosApi
      .listOwn()
      .then((data) => setOwnerServices(data))
      .catch(() => setOwnerServices([]));
  }, [sessionUser]);

  const activePet = useMemo(() => {
    if (!pets.length) {
      return null;
    }

    return pets.find((pet) => pet.id === activePetId) ?? pets[0];
  }, [activePetId, pets]);

  async function handleRegisterUser(formData) {
    try {
      await authApi.register(formData);
      return { ok: true, message: 'Cadastro criado. Agora faca login para acessar sua conta.' };
    } catch (error) {
      return { ok: false, message: error.message || 'Nao foi possivel concluir o cadastro.' };
    }
  }

  async function handleLogin(credentials) {
    try {
      const auth = await authApi.login(credentials);
      setToken(auth.token);
      setSessionUser(auth.user);
      setActivePetId(null);
      setActiveTab('request');
      if (auth.user?.role === 'owner' && auth.user.petshopId) {
        setSelectedPetshopId(auth.user.petshopId);
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message || 'Email ou senha invalidos.' };
    }
  }

  function handleLogout() {
    clearToken();
    setSessionUser(null);
    setPets([]);
    setHistory([]);
    setNotifications([]);
    setOwnerServices([]);
    setActivePetId(null);
    setActiveTab('request');
  }

  async function addOwnerService(payload) {
    if (sessionUser?.role !== 'owner') {
      return;
    }

    try {
      const created = await servicosApi.create(payload);
      setOwnerServices((current) => [created, ...current]);
    } catch {
      // Falha silenciosa para preservar UX atual sem alertas modais.
    }
  }

  async function deleteOwnerService(serviceId) {
    if (sessionUser?.role !== 'owner') {
      return;
    }

    try {
      await servicosApi.remove(serviceId);
      setOwnerServices((current) => current.filter((service) => service.id !== serviceId));
    } catch {
      // Falha silenciosa para preservar UX atual sem alertas modais.
    }
  }

  async function addPet(petData) {
    try {
      const created = await petsApi.create(petData);
      setPets((current) => [...current, created]);
      setActivePetId(created.id);
      setActiveTab('request');
    } catch {
      // Falha silenciosa para preservar UX atual sem alertas modais.
    }
  }

  async function updatePet(petId, petData) {
    if (!petId) {
      return;
    }

    try {
      const updated = await petsApi.update(petId, petData);
      setPets((current) => current.map((pet) => (pet.id === updated.id ? updated : pet)));
    } catch {
      // Falha silenciosa para preservar UX atual sem alertas modais.
    }
  }

  async function loadAvailability(petshopId, serviceId, date) {
    if (!petshopId || !serviceId) {
      return { availableDates: [], availableTimes: [] };
    }

    try {
      return await agendamentosApi.availability(petshopId, serviceId, date);
    } catch {
      return { availableDates: [], availableTimes: [] };
    }
  }

  async function scheduleService(service, petshopIdOverride, selectedDateTime) {
    if (!activePet) {
      return;
    }

    const targetPetshopId = petshopIdOverride || selectedPetshopId;
    if (!targetPetshopId) {
      return;
    }
    if (!selectedDateTime) {
      return;
    }

    const payload = {
      petId: activePet.id,
      petshopId: targetPetshopId,
      dateTime: selectedDateTime,
      type: service.category === 'bath' ? 'Banho' : 'Vacina',
      serviceId: service.id,
      service: service.name
    };

    try {
      const created = await agendamentosApi.create(payload);
      setHistory((current) => [created, ...current]);
      setActiveTab('history');
    } catch {
      // Falha silenciosa para preservar UX atual sem alertas modais.
    }
  }

  async function cancelService(serviceId) {
    if (sessionUser?.role !== 'tutor') {
      return;
    }

    try {
      const updated = await agendamentosApi.cancel(serviceId);
      setHistory((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch {
      // Falha silenciosa para preservar UX atual sem alertas modais.
    }
  }

  async function cancelServiceByOwner(serviceId) {
    if (sessionUser?.role !== 'owner') {
      return;
    }

    try {
      const updated = await agendamentosApi.cancel(serviceId);
      setHistory((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch {
      // Falha silenciosa para preservar UX atual sem alertas modais.
    }
  }

  useEffect(() => {
    if (!selectedPetshopId) {
      setCatalogServices({ baths: [], vaccines: [] });
      return;
    }

    servicosApi
      .catalog(selectedPetshopId)
      .then((data) => setCatalogServices(data))
      .catch(() => setCatalogServices({ baths: [], vaccines: [] }));
  }, [selectedPetshopId]);

  const sseConnected = useServiceCatalogStream(selectedPetshopId, (update) => {
    setCatalogServices((prev) => {
      if (!prev || !update?.servico || !update?.action) {
        return prev;
      }

      const servico = update.servico;
      const action = update.action;
      const isBath = servico.category === 'bath';
      const nextBaths = prev.baths.filter((s) => s.id !== servico.id);
      const nextVaccines = prev.vaccines.filter((s) => s.id !== servico.id);

      if (action === 'REMOVED') {
        return {
          baths: nextBaths,
          vaccines: nextVaccines
        };
      }

      if (action === 'ADDED') {
        return {
          baths: isBath ? [servico, ...nextBaths] : nextBaths,
          vaccines: !isBath ? [servico, ...nextVaccines] : nextVaccines
        };
      }

      return {
        baths: prev.baths,
        vaccines: prev.vaccines
      };
    });
  });

  useEffect(() => {
    setRealtimeEnabled(sseConnected);
  }, [sseConnected]);

  if (!sessionUser) {
    return <AuthPage onRegister={handleRegisterUser} onLogin={handleLogin} />;
  }

  if (sessionUser.role === 'owner') {
    return (
      <OwnerDashboardPage
        owner={sessionUser}
        appointments={history}
        services={ownerServices}
        onAddService={addOwnerService}
        onDeleteService={deleteOwnerService}
        onCancelAppointment={cancelServiceByOwner}
        onLogout={handleLogout}
      />
    );
  }

  const petHistory = activePet
    ? history.filter((item) => item.userId === sessionUser.id && item.petId === activePet.id)
    : [];
  const petVaccines = activePet
    ? vaccinationRecords.filter((record) => record.petId === activePet.id)
    : [];
  const tutorNotifications = notifications.filter((notification) => notification.userId === sessionUser.id);

  return (
    <TutorDashboardPage
      tutor={sessionUser}
      activePet={activePet}
      pets={pets}
      activeTab={activeTab}
      notifications={tutorNotifications}
      petshops={petshops}
      selectedPetshopId={selectedPetshopId}
      services={catalogServices}
      realtimeEnabled={realtimeEnabled}
      petHistory={petHistory}
      petVaccines={petVaccines}
      onTabChange={setActiveTab}
      onPetChange={setActivePetId}
      onLogout={handleLogout}
      onAddPet={addPet}
      onUpdatePet={updatePet}
      onSelectPetshop={setSelectedPetshopId}
      onLoadAvailability={loadAvailability}
      onSchedule={scheduleService}
      onCancelService={cancelService}
    />
  );
}
