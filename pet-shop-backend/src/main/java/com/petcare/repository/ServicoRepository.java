package com.petcare.repository;

import java.util.List;
import java.util.Optional;

import com.petcare.model.Servico;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.nosql.Template;

/**
 * Camada de repositorio para Servico, sobre o Template do Jakarta NoSQL.
 */
@ApplicationScoped
public class ServicoRepository {

    @Inject
    Template template;

    public Servico insert(Servico servico) {
        return template.insert(servico);
    }

    public Optional<Servico> findById(String id) {
        return template.find(Servico.class, id);
    }

    public List<Servico> findByPetshopId(String petshopId) {
        return template.select(Servico.class)
                .where("petshopId").eq(petshopId)
                .result();
    }

    public void deleteById(String id) {
        template.delete(Servico.class, id);
    }
}
