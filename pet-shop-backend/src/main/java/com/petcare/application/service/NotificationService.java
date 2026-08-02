package com.petcare.application.service;

import com.petcare.shared.util.IdGenerator;

import com.petcare.domain.entity.Agendamento;
import com.petcare.domain.entity.Notificacao;
import com.petcare.infrastructure.persistence.MongoNotificationRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.OffsetDateTime;

/**
 * Responsavel exclusivamente pela criacao de notificacoes.
 */
@ApplicationScoped
public class NotificationService {

    @Inject
    MongoNotificationRepository notificacoes;

    public void sendAppointmentCancelled(Agendamento updated) {
        Notificacao notificacao = new Notificacao();
        notificacao.setId(IdGenerator.newId("notification"));
        notificacao.setUserId(updated.getUserId());
        notificacao.setPetId(updated.getPetId());
        notificacao.setPetshopId(updated.getPetshopId());
        notificacao.setAppointmentId(updated.getId());
        notificacao.setCreatedAt(OffsetDateTime.now().toString());
        notificacao.setTitle("Agendamento cancelado pelo petshop");
        notificacao.setMessage(updated.getService() + " para " + updated.getPet()
                + " foi cancelado pelo petshop.");
        notificacao.setRead(false);
        notificacoes.insert(notificacao);
    }
}






