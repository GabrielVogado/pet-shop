package com.petcare.application.service;

import com.petcare.application.dto.input.ServicoRequest;
import com.petcare.shared.util.IdGenerator;

import java.util.List;

import com.petcare.domain.entity.Servico;
import com.petcare.infrastructure.persistence.MongoServiceRepository;
import com.petcare.infrastructure.web.exception.ApiException;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class ServiceCatalogService {

    @Inject
    MongoServiceRepository servicos;

    public Servico create(String petshopId, ServicoRequest req) {
        if (petshopId == null || petshopId.isBlank()) {
            throw ApiException.forbidden("Usuario owner sem petshop associado.");
        }

        Servico servico = new Servico();
        servico.setId(IdGenerator.newId("service"));
        servico.setPetshopId(petshopId);
        servico.setName(req.name().trim());
        servico.setCategory(req.category());
        servico.setDuration(req.duration());
        servico.setPrice(req.price());
        servico.setDescription(req.description());
        servico.setFeatures(req.features() == null ? List.of() : req.features());
        return servicos.insert(servico);
    }

    public List<Servico> listByPetshop(String petshopId) {
        return servicos.findByPetshopId(petshopId);
    }

    public Servico delete(String petshopId, String servicoId) {
        Servico servico = servicos.findById(servicoId)
                .orElseThrow(() -> ApiException.notFound("Servico nao encontrado."));
        if (!servico.getPetshopId().equals(petshopId)) {
            throw ApiException.forbidden("Servico nao pertence a este petshop.");
        }
        servicos.deleteById(servicoId);
        return servico;
    }
}
