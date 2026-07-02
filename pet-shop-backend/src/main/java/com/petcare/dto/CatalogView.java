package com.petcare.dto;

import java.util.List;

/**
 * Catalogo de um petshop, agrupado por categoria (compativel com o frontend).
 */
public record CatalogView(List<ServicoView> baths, List<ServicoView> vaccines) {
}
