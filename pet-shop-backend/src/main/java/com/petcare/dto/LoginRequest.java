package com.petcare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Informe o email.")
        @Email(message = "Informe um email valido (ex.: nome@dominio.com).")
        String email,

        @NotBlank(message = "Informe a senha.")
        String password) {
}
