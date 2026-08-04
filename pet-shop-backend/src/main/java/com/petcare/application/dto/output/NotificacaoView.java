package com.petcare.application.dto.output;

import com.petcare.application.dto.output.NotificacaoView;

import com.petcare.domain.entity.Notificacao;

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



