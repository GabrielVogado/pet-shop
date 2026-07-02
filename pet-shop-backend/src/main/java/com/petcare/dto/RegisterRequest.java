package com.petcare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Payload de cadastro de tutor ou empresa.
 */
public record RegisterRequest(
        @NotBlank(message = "Selecione um perfil: tutor ou empresa.")
        @Pattern(regexp = "tutor|owner", message = "Perfil invalido: escolha 'tutor' ou 'owner'.")
        String role,

        @NotBlank(message = "Informe o nome completo.")
        @Size(min = 3, max = 120, message = "O nome deve ter entre 3 e 120 caracteres.")
        @Pattern(
                regexp = "^[\\p{L}][\\p{L}'.\\- ]*$",
                message = "O nome deve conter apenas letras, espacos, hifens e apostrofos.")
        String name,

        @NotBlank(message = "Informe o email.")
        @Email(message = "Informe um email valido (ex.: nome@dominio.com).")
        @Size(max = 180, message = "O email pode ter no maximo 180 caracteres.")
        String email,

        @Pattern(
                regexp = "^$|^[0-9()+\\-\\s]{8,30}$",
                message = "Telefone invalido: use apenas numeros, espacos e os simbolos ()+- (8 a 30 caracteres).")
        @Size(max = 30, message = "O telefone pode ter no maximo 30 caracteres.")
        String phone,

        @Size(max = 220, message = "O endereco pode ter no maximo 220 caracteres.")
        String address,

        @NotBlank(message = "Informe a senha.")
        @Size(min = 6, max = 100, message = "A senha deve ter entre 6 e 100 caracteres.")
        String password,

        @Size(max = 120, message = "O nome da loja pode ter no maximo 120 caracteres.")
        String businessName,

        FirstPet firstPet) {

    public record FirstPet(
            @Size(max = 80, message = "O nome do pet pode ter no maximo 80 caracteres.")
            String name,

            @Size(max = 40, message = "A especie pode ter no maximo 40 caracteres.")
            String species,

            @Size(max = 80, message = "A raca pode ter no maximo 80 caracteres.")
            String breed,

            @Size(max = 40, message = "A idade pode ter no maximo 40 caracteres.")
            String age) {
    }
}
