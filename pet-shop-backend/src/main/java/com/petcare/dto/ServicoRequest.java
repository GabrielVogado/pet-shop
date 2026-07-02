package com.petcare.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record ServicoRequest(
        @NotBlank(message = "Informe o nome do servico.")
        @Size(max = 120, message = "O nome do servico pode ter no maximo 120 caracteres.")
        String name,

        @NotBlank(message = "Informe a categoria do servico.")
        @Pattern(regexp = "bath|vaccine", message = "Categoria invalida: escolha 'bath' (banho) ou 'vaccine' (vacina).")
        String category,

        @Size(max = 40, message = "A duracao pode ter no maximo 40 caracteres.")
        String duration,

        @Positive(message = "O preco deve ser maior que zero.")
        double price,

        @Size(max = 280, message = "A descricao pode ter no maximo 280 caracteres.")
        String description,

        List<@Size(max = 80, message = "Cada item pode ter no maximo 80 caracteres.") String> features) {
}
