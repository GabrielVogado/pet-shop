package com.petcare.repository;

import java.util.List;

import com.petcare.model.Notificacao;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.nosql.Template;

/**
 * Camada de repositorio para Notificacao, sobre o Template do Jakarta NoSQL.
 */
@ApplicationScoped
public class NotificacaoRepository {

    @Inject
    Template template;

    public Notificacao insert(Notificacao notificacao) {
        return template.insert(notificacao);
    }

    public List<Notificacao> findByUserId(String userId) {
        return template.select(Notificacao.class)
                .where("userId").eq(userId)
                .result();
    }
}
