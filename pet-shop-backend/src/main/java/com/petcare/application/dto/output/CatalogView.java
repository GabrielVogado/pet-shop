package com.petcare.application.dto.output;

import com.petcare.application.dto.output.ServicoView;

import com.petcare.application.dto.output.CatalogView;

import java.util.List;

/**
 * Catalogo de um petshop, agrupado por categoria (compativel com o frontend).
 */
public record CatalogView(List<ServicoView> baths, List<ServicoView> vaccines) {
}


