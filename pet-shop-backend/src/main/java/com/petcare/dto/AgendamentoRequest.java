package com.petcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AgendamentoRequest(
        @NotBlank(message = "Selecione o pet.")
        String petId,

        @NotBlank(message = "Selecione o petshop.")
        String petshopId,

        @NotBlank(message = "Informe a data e hora do agendamento.")
        String dateTime,

        @NotBlank(message = "Informe o tipo de agendamento.")
        @Pattern(regexp = "Banho|Vacina", message = "Tipo invalido: escolha 'Banho' ou 'Vacina'.")
        String type,

        @NotBlank(message = "Informe o identificador do servico.")
        String serviceId,

        @NotBlank(message = "Informe o servico desejado.")
        @Size(max = 120, message = "O nome do servico pode ter no maximo 120 caracteres.")
        String service) {
}
