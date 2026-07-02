package com.petcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PetRequest(
        @NotBlank(message = "Informe o nome do pet.")
        @Size(max = 80, message = "O nome do pet pode ter no maximo 80 caracteres.")
        String name,

        @NotBlank(message = "Informe a especie do pet.")
        @Size(max = 40, message = "A especie pode ter no maximo 40 caracteres.")
        String species,

        @Size(max = 80, message = "A raca pode ter no maximo 80 caracteres.")
        String breed,

        @Size(max = 40, message = "A idade pode ter no maximo 40 caracteres.")
        String age,

        @Size(max = 280, message = "As observacoes podem ter no maximo 280 caracteres.")
        String notes) {
}
