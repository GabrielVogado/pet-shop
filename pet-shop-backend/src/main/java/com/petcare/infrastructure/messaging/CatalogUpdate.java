package com.petcare.infrastructure.messaging;

import com.petcare.application.dto.output.ServicoView;

public record CatalogUpdate(String action, ServicoView servico) {
}



