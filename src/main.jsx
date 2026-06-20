import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarPlus, History, ShieldCheck } from 'lucide-react';
import mockDb from './data/mockDb.json';
import { AppShell } from './components/AppShell';
import { AuthScreen } from './components/AuthScreen';
import { OwnerDashboard } from './components/OwnerDashboard';
import { PetRegistration } from './components/PetRegistration';
import { ServiceRequest } from './components/ServiceRequest';
import { ServiceHistory } from './components/ServiceHistory';
import { VaccinationWallet } from './components/VaccinationWallet';
import './index.css';

const tabs = [
  { id: 'request', label: 'Solicitar Servico', icon: CalendarPlus },
  { id: 'history', label: 'Historico de Servicos', icon: History },
  { id: 'wallet', label: 'Carteira de Vacinacao', icon: ShieldCheck }
];

const storageKeys = {
  users: 'petcare.users',
  history: 'petcare.history',
  vaccinations: 'petcare.vaccinations',
  notifications: 'petcare.notifications'
};

const defaultPetshopId = 'petshop-higgins';

function readStorage(key, fallback) {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeUsers(users) {
  return users.map((user) => {
    const role = user.role ?? 'tutor';

    return {
      ...user,
      role,
      petshopId: role === 'owner' ? user.petshopId ?? defaultPetshopId : undefined,
      businessName: role === 'owner' ? user.businessName ?? user.name : undefined,
      pets: role === 'tutor' ? user.pets ?? [] : []
    };
  });
}

function mergeSeedUsers(storedUsers) {
  const normalizedStoredUsers = normalizeUsers(storedUsers);
  const missingSeedUsers = normalizeUsers(mockDb.users).filter(
    (seedUser) =>
      !normalizedStoredUsers.some(
        (storedUser) => storedUser.id === seedUser.id || storedUser.email === seedUser.email
      )
  );

  return [...normalizedStoredUsers, ...missingSeedUsers];
}

function normalizeHistory(history, users) {
  const tutorUsers = users.filter((user) => user.role === 'tutor');

  return history.map((item) => {
    const fallbackTutor = tutorUsers.find((user) =>
      user.pets.some((pet) => pet.id === item.petId || pet.name === item.pet)
    );
    const fallbackPet = fallbackTutor?.pets.find(
      (pet) => pet.id === item.petId || pet.name === item.pet
    );

    return {
      ...item,
      dateTime: item.dateTime ?? item.date ?? new Date().toLocaleString('pt-BR'),
      date: item.date ?? item.dateTime ?? new Date().toLocaleDateString('pt-BR'),
      userId: item.userId ?? fallbackTutor?.id ?? 'user-001',
      tutor: item.tutor ?? fallbackTutor?.name ?? 'Tutor nao identificado',
      petId: item.petId ?? fallbackPet?.id ?? 'pet-unknown',
      pet: item.pet ?? fallbackPet?.name ?? 'Pet nao identificado',
      petshopId: item.petshopId ?? defaultPetshopId
    };
  });
}

function createPetshopId(businessName, existingUsers) {
  const baseSlug = businessName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
  const seed = baseSlug || 'petshop';
  let candidate = `${seed}-${Date.now().toString(36)}`;
  let counter = 1;

  while (existingUsers.some((user) => user.petshopId === candidate)) {
    candidate = `${seed}-${Date.now().toString(36)}-${counter}`;
    counter += 1;
  }

  return candidate;
}

function App() {
  const [users, setUsers] = useState(() =>
    mergeSeedUsers(readStorage(storageKeys.users, mockDb.users))
  );
  const [sessionUserId, setSessionUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('request');
  const [activePetId, setActivePetId] = useState(null);
  const [history, setHistory] = useState(() =>
    normalizeHistory(
      readStorage(storageKeys.history, mockDb.serviceHistory),
      mergeSeedUsers(readStorage(storageKeys.users, mockDb.users))
    )
  );
  const [vaccinationRecords] = useState(() =>
    readStorage(storageKeys.vaccinations, mockDb.vaccinationRecords)
  );
  const [notifications, setNotifications] = useState(() =>
    readStorage(storageKeys.notifications, mockDb.notifications ?? [])
  );

  useEffect(() => {
    window.localStorage.setItem(storageKeys.users, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.history, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.vaccinations, JSON.stringify(vaccinationRecords));
  }, [vaccinationRecords]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.notifications, JSON.stringify(notifications));
  }, [notifications]);

  const sessionUser = useMemo(
    () => users.find((user) => user.id === sessionUserId) ?? null,
    [users, sessionUserId]
  );

  const activePet = useMemo(() => {
    if (!sessionUser?.pets.length) {
      return null;
    }

    return sessionUser.pets.find((pet) => pet.id === activePetId) ?? sessionUser.pets[0];
  }, [activePetId, sessionUser]);

  function handleRegisterUser(formData) {
    if (!['tutor', 'owner'].includes(formData.role)) {
      return { ok: false, message: 'Selecione se voce e Tutor ou Empresa.' };
    }

    const emailAlreadyExists = users.some(
      (user) => user.email.toLowerCase() === formData.email.toLowerCase()
    );

    if (emailAlreadyExists) {
      return { ok: false, message: 'Este email ja esta cadastrado.' };
    }

    if (formData.role === 'owner' && !formData.businessName?.trim()) {
      return { ok: false, message: 'Informe a razao social ou nome da loja.' };
    }

    const firstPet =
      formData.role === 'tutor' && formData.firstPet?.name
        ? [
            {
              id: `pet-${Date.now()}`,
              name: formData.firstPet.name,
              species: formData.firstPet.species,
              breed: formData.firstPet.breed,
              age: '',
              notes: ''
            }
          ]
        : [];
    const requestedPetshopId = formData.petshopId;
    const petshopIdAlreadyExists = users.some((user) => user.petshopId === requestedPetshopId);
    const generatedPetshopId =
      formData.role === 'owner'
        ? requestedPetshopId && !petshopIdAlreadyExists
          ? requestedPetshopId
          : createPetshopId(formData.businessName, users)
        : undefined;

    const nextUser = {
      id: `user-${Date.now()}`,
      role: formData.role,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      ...(formData.role === 'owner'
        ? {
            businessName: formData.businessName,
            petshopId: generatedPetshopId,
            pets: []
          }
        : {
            pets: firstPet
          })
    };

    setUsers((current) => [...current, nextUser]);
    return { ok: true, message: 'Cadastro criado. Agora faca login para acessar sua conta.' };
  }

  function handleLogin(credentials) {
    const foundUser = users.find(
      (user) =>
        user.email.toLowerCase() === credentials.email.toLowerCase() &&
        user.password === credentials.password
    );

    if (!foundUser) {
      return { ok: false, message: 'Email ou senha invalidos.' };
    }

    setSessionUserId(foundUser.id);
    setActivePetId(foundUser.role === 'tutor' ? foundUser.pets[0]?.id ?? null : null);
    setActiveTab('request');
    return { ok: true };
  }

  function handleLogout() {
    setSessionUserId(null);
    setActivePetId(null);
    setActiveTab('request');
  }

  function addPet(petData) {
    const nextPet = {
      id: `pet-${Date.now()}`,
      name: petData.name,
      species: petData.species,
      breed: petData.breed,
      age: petData.age,
      notes: petData.notes
    };

    setUsers((current) =>
      current.map((user) =>
        user.id === sessionUserId ? { ...user, pets: [...user.pets, nextPet] } : user
      )
    );
    setActivePetId(nextPet.id);
    setActiveTab('request');
  }

  function scheduleService(service) {
    if (!activePet) {
      return;
    }

    const nextItem = {
      id: `svc-${Date.now()}`,
      userId: sessionUser.id,
      tutor: sessionUser.name,
      petshopId: defaultPetshopId,
      petId: activePet.id,
      dateTime: new Date().toLocaleString('pt-BR'),
      date: new Date().toLocaleDateString('pt-BR'),
      type: service.category === 'bath' ? 'Banho' : 'Vacina',
      service: service.name,
      pet: activePet.name,
      status: 'Agendado'
    };

    setHistory((current) => [nextItem, ...current]);
    setActiveTab('history');
  }

  function cancelService(serviceId) {
    if (sessionUser?.role !== 'tutor') {
      return;
    }

    setHistory((current) =>
      current.map((item) =>
        item.id === serviceId &&
        item.userId === sessionUser.id &&
        item.status === 'Agendado'
          ? { ...item, status: 'Cancelado' }
          : item
      )
    );
  }

  function cancelServiceByOwner(serviceId) {
    if (sessionUser?.role !== 'owner') {
      return;
    }

    const appointment = history.find(
      (item) =>
        item.id === serviceId &&
        item.petshopId === sessionUser.petshopId &&
        item.status === 'Agendado'
    );

    if (!appointment) {
      return;
    }

    setHistory((current) =>
      current.map((item) =>
        item.id === serviceId && item.petshopId === sessionUser.petshopId
          ? { ...item, status: 'Cancelado', canceledBy: 'petshop' }
          : item
      )
    );

    setNotifications((current) => [
      {
        id: `notification-${Date.now()}`,
        userId: appointment.userId,
        petId: appointment.petId,
        petshopId: appointment.petshopId,
        appointmentId: appointment.id,
        createdAt: new Date().toLocaleString('pt-BR'),
        title: 'Agendamento cancelado pelo petshop',
        message: `${appointment.service} para ${appointment.pet} foi cancelado pelo petshop.`,
        read: false
      },
      ...current
    ]);
  }

  if (!sessionUser) {
    return <AuthScreen onRegister={handleRegisterUser} onLogin={handleLogin} />;
  }

  if (sessionUser.role === 'owner') {
    const ownerAppointments = history.filter((item) => item.petshopId === sessionUser.petshopId);

    return (
      <OwnerDashboard
        owner={sessionUser}
        appointments={ownerAppointments}
        users={users}
        onCancelAppointment={cancelServiceByOwner}
        onLogout={handleLogout}
      />
    );
  }

  const petHistory = activePet
    ? history.filter(
        (item) =>
          item.userId === sessionUser.id &&
          item.petId === activePet.id
      )
    : [];
  const petVaccines = activePet
    ? vaccinationRecords.filter((record) => record.petId === activePet.id)
    : [];
  const tutorNotifications = notifications.filter(
    (notification) => notification.userId === sessionUser.id
  );

  return (
    <AppShell
      tutor={sessionUser}
      activePet={activePet}
      pets={sessionUser.pets}
      tabs={tabs}
      activeTab={activeTab}
      activePetId={activePet?.id ?? null}
      notifications={tutorNotifications}
      onTabChange={setActiveTab}
      onPetChange={setActivePetId}
      onLogout={handleLogout}
    >
      <PetRegistration pets={sessionUser.pets} onAddPet={addPet} />

      {activePet && activeTab === 'request' && (
        <ServiceRequest pet={activePet} services={mockDb.services} onSchedule={scheduleService} />
      )}
      {activePet && activeTab === 'history' && (
        <ServiceHistory history={petHistory} onCancelService={cancelService} />
      )}
      {activePet && activeTab === 'wallet' && (
        <VaccinationWallet pet={activePet} vaccinations={petVaccines} />
      )}
    </AppShell>
  );
}

createRoot(document.getElementById('root')).render(<App />);
