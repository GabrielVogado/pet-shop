package com.petcare.dto;

import com.petcare.model.Notificacao;

public record NotificacaoView(
        String id,
        String userId,
        String petId,
        String petshopId,
        String appointmentId,
        String createdAt,
        String title,
        String message,
        boolean read) {

    public static NotificacaoView from(Notificacao n) {
        return new NotificacaoView(
                n.getId(), n.getUserId(), n.getPetId(), n.getPetshopId(),
                n.getAppointmentId(), n.getCreatedAt(), n.getTitle(),
                n.getMessage(), n.getRead());
    }
}
