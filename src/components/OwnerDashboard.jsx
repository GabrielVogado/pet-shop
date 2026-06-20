import React, { useMemo, useState } from 'react';
import {
  CalendarCheck,
  LogOut,
  PawPrint,
  ShieldCheck,
  Store,
  Syringe,
  User,
  Waves
} from 'lucide-react';

export function OwnerDashboard({ owner, appointments, users, onCancelAppointment, onLogout }) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(appointments[0]?.id ?? null);

  const metrics = useMemo(() => {
    return {
      total: appointments.length,
      scheduled: appointments.filter((item) => item.status === 'Agendado').length,
      baths: appointments.filter((item) => item.type === 'Banho').length,
      vaccines: appointments.filter((item) => item.type === 'Vacina').length
    };
  }, [appointments]);

  const selectedAppointment =
    appointments.find((appointment) => appointment.id === selectedAppointmentId) ??
    appointments[0] ??
    null;
  const selectedTutor = selectedAppointment
    ? users.find((user) => user.id === selectedAppointment.userId)
    : null;
  const selectedPet = selectedTutor?.pets.find((pet) => pet.id === selectedAppointment?.petId);

  function getTutorName(appointment) {
    return (
      users.find((user) => user.id === appointment.userId)?.name ??
      appointment.tutor ??
      'Tutor nao identificado'
    );
  }

  function handleCancel() {
    if (!selectedAppointment) {
      return;
    }

    onCancelAppointment(selectedAppointment.id);
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-ocean text-white shadow-soft">
              <Store size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink">Dashboard do Petshop</h1>
              <p className="text-sm text-ink/60">
                Dono: <span className="font-semibold text-ink">{owner.name}</span> | Petshop:{' '}
                <span className="font-semibold text-ink">{owner.petshopId}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex min-h-10 items-center justify-center gap-2 rounded border border-ink/10 bg-white px-3 text-sm font-bold text-ink/70 transition hover:bg-mint hover:text-ink"
          >
            <LogOut size={17} />
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Visao de negocios</p>
          <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">
            Agendamentos do estabelecimento
          </h2>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={CalendarCheck} label="Total" value={metrics.total} />
          <MetricCard icon={ShieldCheck} label="Agendados" value={metrics.scheduled} />
          <MetricCard icon={Waves} label="Banhos" value={metrics.baths} />
          <MetricCard icon={Syringe} label="Vacinas" value={metrics.vaccines} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="overflow-hidden rounded-md border border-ink/10 bg-white shadow-soft">
            <div className="border-b border-ink/10 px-5 py-4">
              <h3 className="font-bold text-ink">Agenda recebida</h3>
              <p className="mt-1 text-sm text-ink/60">
                Somente agendamentos vinculados ao petshop deste usuario owner.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-ink/10">
                <thead className="bg-mint/65">
                  <tr>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Servico</TableHead>
                    <TableHead>Nome do Tutor</TableHead>
                    <TableHead>Nome do Pet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Acao</TableHead>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {appointments.length === 0 ? (
                    <tr>
                      <td className="px-4 py-8 text-center text-sm text-ink/55" colSpan="6">
                        Nenhum agendamento encontrado para este petshop.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appointment) => {
                      const isSelected = selectedAppointment?.id === appointment.id;

                      return (
                        <tr
                          key={appointment.id}
                          className={isSelected ? 'bg-mint/40' : 'hover:bg-paper'}
                        >
                          <TableCell>{appointment.dateTime ?? appointment.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {appointment.type === 'Banho' ? (
                                <Waves size={16} className="text-ocean" />
                              ) : (
                                <Syringe size={16} className="text-coral" />
                              )}
                              <span>
                                {appointment.type} | {appointment.service}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getTutorName(appointment)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <PawPrint size={16} className="text-coral" />
                              {appointment.pet}
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={appointment.status} />
                          </TableCell>
                          <TableCell>
                            <button
                              type="button"
                              onClick={() => setSelectedAppointmentId(appointment.id)}
                              className="min-h-9 rounded bg-ink px-3 text-xs font-bold text-white transition hover:bg-ink/90"
                            >
                              Ver detalhes
                            </button>
                          </TableCell>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <AppointmentDetails
            appointment={selectedAppointment}
            tutor={selectedTutor}
            pet={selectedPet}
            onCancel={handleCancel}
          />
        </section>
      </main>
    </div>
  );
}

function AppointmentDetails({ appointment, tutor, pet, onCancel }) {
  if (!appointment) {
    return (
      <aside className="rounded-md border border-ink/10 bg-white p-5 text-sm text-ink/55 shadow-soft">
        Selecione um agendamento para ver os dados do cliente e do pet.
      </aside>
    );
  }

  return (
    <aside className="space-y-4 rounded-md border border-ink/10 bg-white p-5 shadow-soft">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-ocean">Detalhes</p>
        <h3 className="mt-1 text-xl font-bold text-ink">{appointment.service}</h3>
        <div className="mt-3">
          <StatusBadge status={appointment.status} />
        </div>
      </div>

      <InfoGroup icon={CalendarCheck} title="Agendamento">
        <InfoLine label="Data/Hora" value={appointment.dateTime ?? appointment.date} />
        <InfoLine label="Tipo" value={appointment.type} />
        <InfoLine label="Petshop" value={appointment.petshopId} />
      </InfoGroup>

      <InfoGroup icon={User} title="Cliente">
        <InfoLine label="Nome" value={tutor?.name ?? appointment.tutor} />
        <InfoLine label="Email" value={tutor?.email ?? 'Nao informado'} />
        <InfoLine label="Telefone" value={tutor?.phone ?? 'Nao informado'} />
        <InfoLine label="User ID" value={appointment.userId} />
      </InfoGroup>

      <InfoGroup icon={PawPrint} title="Pet">
        <InfoLine label="Nome" value={pet?.name ?? appointment.pet} />
        <InfoLine label="Especie" value={pet?.species ?? 'Nao informado'} />
        <InfoLine label="Raca" value={pet?.breed ?? 'Nao informado'} />
        <InfoLine label="Idade" value={pet?.age ?? 'Nao informado'} />
        <InfoLine label="Observacoes" value={pet?.notes || 'Sem observacoes'} />
      </InfoGroup>

      <button
        type="button"
        onClick={onCancel}
        disabled={appointment.status !== 'Agendado'}
        className="flex min-h-11 w-full items-center justify-center rounded bg-coral px-4 text-sm font-bold text-white transition hover:bg-[#dc5848] disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/45"
      >
        Cancelar agendamento
      </button>
    </aside>
  );
}

function MetricCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-md border border-ink/10 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink/55">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded bg-mint text-ocean">
          <Icon size={21} />
        </div>
      </div>
    </article>
  );
}

function InfoGroup({ icon: Icon, title, children }) {
  return (
    <section className="rounded border border-ink/10 bg-paper p-4">
      <div className="flex items-center gap-2">
        <Icon size={17} className="text-coral" />
        <h4 className="font-bold text-ink">{title}</h4>
      </div>
      <dl className="mt-3 space-y-2">{children}</dl>
    </section>
  );
}

function InfoLine({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-ink/45">{label}</dt>
      <dd className="break-words text-sm font-semibold text-ink/75">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Agendado: 'bg-mint text-ocean',
    Concluido: 'bg-ink text-white',
    Cancelado: 'bg-coral/15 text-coral'
  };

  return (
    <span
      className={`inline-flex min-w-24 justify-center rounded px-3 py-1 text-xs font-bold ${
        styles[status] ?? 'bg-ink/10 text-ink'
      }`}
    >
      {status}
    </span>
  );
}

function TableHead({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ink/65">
      {children}
    </th>
  );
}

function TableCell({ children }) {
  return <td className="whitespace-nowrap px-4 py-4 text-sm text-ink/75">{children}</td>;
}
