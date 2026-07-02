package com.petcare.service;

import java.util.List;

import com.petcare.dto.ServicoRequest;
import com.petcare.dto.ServicoView;
import com.petcare.model.Servico;
import com.petcare.repository.ServicoRepository;
import com.petcare.rest.ApiException;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class ServicoService {

    @Inject
    ServicoRepository servicos;

    public Servico create(String petshopId, ServicoRequest req) {
        if (petshopId == null || petshopId.isBlank()) {
            throw ApiException.forbidden("Usuario owner sem petshop associado.");
        }

        Servico servico = new Servico();
        servico.setId(Ids.newId("service"));
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
