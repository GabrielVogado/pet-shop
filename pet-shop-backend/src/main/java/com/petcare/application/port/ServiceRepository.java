package com.petcare.application.port;

import com.petcare.domain.entity.Servico;
import java.util.List;
import java.util.Optional;

public interface ServiceRepository {
    Servico insert(Servico servico);
    Servico update(Servico servico);
    Optional<Servico> findById(String id);
    List<Servico> findByPetshopId(String petshopId);
    void delete(String id);
}
