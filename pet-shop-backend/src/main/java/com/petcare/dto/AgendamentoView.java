package com.petcare.dto;

import com.petcare.model.Agendamento;
import com.petcare.model.Pet;
import com.petcare.model.Usuario;

public record AgendamentoView(
        String id,
        String userId,
        String tutor,
        String tutorAddress,
    String tutorEmail,
    String tutorPhone,
        String petshopId,
        String petId,
        String pet,
        String petSpecies,
        String petBreed,
        String petAge,
        String petNotes,
        String dateTime,
        String type,
        String serviceId,
        String service,
        Integer durationMinutes,
        String status,
        String canceledBy) {

    public static AgendamentoView from(Agendamento a) {
        return new AgendamentoView(
                a.getId(), a.getUserId(), a.getTutor(), a.getTutorAddress(), null, null, a.getPetshopId(),
                a.getPetId(), a.getPet(), null, null, null, null, a.getDateTime(), a.getType(),
                a.getServiceId(), a.getService(), a.getDurationMinutes(), a.getStatus(), a.getCanceledBy());
    }

    public static AgendamentoView from(Agendamento a, Usuario tutorUser) {
        return new AgendamentoView(
                a.getId(),
                a.getUserId(),
                a.getTutor(),
                a.getTutorAddress(),
                tutorUser != null ? tutorUser.getEmail() : null,
                tutorUser != null ? tutorUser.getPhone() : null,
                a.getPetshopId(),
                a.getPetId(),
                a.getPet(),
                null,
                null,
                null,
                null,
                a.getDateTime(),
                a.getType(),
                a.getServiceId(),
                a.getService(),
                a.getDurationMinutes(),
                a.getStatus(),
                a.getCanceledBy());
    }

    public static AgendamentoView from(Agendamento a, Usuario tutorUser, Pet pet) {
        return new AgendamentoView(
                a.getId(),
                a.getUserId(),
                a.getTutor(),
                a.getTutorAddress(),
                tutorUser != null ? tutorUser.getEmail() : null,
                tutorUser != null ? tutorUser.getPhone() : null,
                a.getPetshopId(),
                a.getPetId(),
                a.getPet(),
                pet != null ? pet.getSpecies() : null,
                pet != null ? pet.getBreed() : null,
                pet != null ? pet.getAge() : null,
                pet != null ? pet.getNotes() : null,
                a.getDateTime(),
                a.getType(),
                a.getServiceId(),
                a.getService(),
                a.getDurationMinutes(),
                a.getStatus(),
                a.getCanceledBy());
    }
}
