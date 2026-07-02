package com.petcare.service;

import com.petcare.model.Agendamento;
import com.petcare.model.Notificacao;
import com.petcare.repository.NotificacaoRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.time.OffsetDateTime;

/**
 * Responsavel exclusivamente pela criacao de notificacoes.
 */
@ApplicationScoped
public class NotificationService {

    @Inject
    NotificacaoRepository notificacoes;

    public void sendAppointmentCancelled(Agendamento updated) {
        Notificacao notificacao = new Notificacao();
        notificacao.setId(Ids.newId("notification"));
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
