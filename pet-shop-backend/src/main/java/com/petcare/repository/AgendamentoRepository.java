package com.petcare.repository;

import java.util.List;
import java.util.Optional;

import com.petcare.model.Agendamento;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.nosql.Template;

/**
 * Camada de repositorio para Agendamento, sobre o Template do Jakarta NoSQL.
 */
@ApplicationScoped
public class AgendamentoRepository {

    @Inject
    Template template;

    public Agendamento insert(Agendamento agendamento) {
        return template.insert(agendamento);
    }

    public Agendamento update(Agendamento agendamento) {
        return template.update(agendamento);
    }

    public Optional<Agendamento> findById(String id) {
        return template.find(Agendamento.class, id);
    }

    public List<Agendamento> findByUserId(String userId) {
        return template.select(Agendamento.class)
                .where("userId").eq(userId)
                .result();
    }

    public List<Agendamento> findByPetshopId(String petshopId) {
        return template.select(Agendamento.class)
                .where("petshopId").eq(petshopId)
                .result();
    }
}
