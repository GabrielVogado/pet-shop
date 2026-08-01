package com.petcare.application.port;

import com.petcare.domain.entity.Agendamento;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository {
    Agendamento insert(Agendamento agendamento);
    Agendamento update(Agendamento agendamento);
    Optional<Agendamento> findById(String id);
    List<Agendamento> findByPetshopId(String petshopId);
    List<Agendamento> findByUserId(String userId);
    List<Agendamento> findByPetshopIdAndDateTimeBetween(String petshopId, LocalDateTime start, LocalDateTime end);
}
