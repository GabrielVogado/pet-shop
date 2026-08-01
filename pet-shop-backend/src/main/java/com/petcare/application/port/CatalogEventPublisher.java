package com.petcare.application.port;

import com.petcare.domain.entity.Servico;

public interface CatalogEventPublisher {
    void publishAdded(Servico servico);
    void publishRemoved(String servicoId, String petshopId);
}
