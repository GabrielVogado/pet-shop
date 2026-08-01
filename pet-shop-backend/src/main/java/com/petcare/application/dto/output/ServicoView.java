package com.petcare.application.dto.output;

import com.petcare.application.dto.output.ServicoView;

import com.petcare.domain.entity.Servico;

public record ServicoView(
        String id,
        String petshopId,
        String name,
        String category,
        String duration,
        double price,
        String description,
        java.util.List<String> features) {

    public static ServicoView from(Servico s) {
        return new ServicoView(
                s.getId(),
                s.getPetshopId(),
                s.getName(),
                s.getCategory(),
                s.getDuration(),
                s.getPrice(),
                s.getDescription(),
                s.getFeatures());
    }
}



