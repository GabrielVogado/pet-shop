package com.petcare.application.service;

import com.petcare.application.dto.input.RegisterRequest;
import com.petcare.application.port.PetRepository;
import com.petcare.application.port.UserRepository;
import com.petcare.domain.entity.Pet;
import com.petcare.domain.entity.Usuario;
import com.petcare.domain.valueobject.UserRole;
import com.petcare.infrastructure.security.BCryptPasswordEncoder;
import com.petcare.infrastructure.web.exception.ApiException;
import com.petcare.shared.util.IdGenerator;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * Serviço de cadastro de usuários.
 * Extraído de AuthService.register() — SRP: apenas registro.
 */
@ApplicationScoped
public class RegistrationService {
    public static final String SINGLE_PETSHOP_ID = "petshop-unico";

    @Inject
    UserRepository usuarios;

    @Inject
    PetRepository pets;

    @Inject
    BCryptPasswordEncoder passwordEncoder;

    public Usuario register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();

        if (usuarios.findByEmail(email).isPresent()) {
            throw ApiException.conflict("Este email ja esta cadastrado.");
        }

        boolean owner = UserRole.OWNER.getValue().equals(req.role());
        if (owner && (req.businessName() == null || req.businessName().isBlank())) {
            throw ApiException.badRequest("Informe a razao social ou nome da loja.");
        }
        if (owner && usuarios.findAll().stream().anyMatch(u -> UserRole.OWNER.getValue().equals(u.getRole()))) {
            throw ApiException.conflict("Ja existe um petshop cadastrado no sistema.");
        }
        if (!owner && (req.phone() == null || req.phone().isBlank())) {
            throw ApiException.badRequest("Informe o telefone do tutor.");
        }
        if (!owner && (req.address() == null || req.address().isBlank())) {
            throw ApiException.badRequest("Informe o endereco do tutor.");
        }

        Usuario usuario = new Usuario();
        usuario.setId(IdGenerator.newId("user"));
        usuario.setRole(req.role());
        usuario.setName(req.name().trim());
        usuario.setEmail(email);
        usuario.setPhone(req.phone() == null ? null : req.phone().trim());
        usuario.setAddress(req.address() == null ? null : req.address().trim());
        usuario.setPasswordHash(passwordEncoder.hash(req.password()));

        if (owner) {
            usuario.setBusinessName(req.businessName().trim());
            usuario.setPetshopId(SINGLE_PETSHOP_ID);
        }

        Usuario saved = usuarios.insert(usuario);

        // Cadastro opcional do primeiro pet (apenas tutor).
        if (!owner && req.firstPet() != null
                && req.firstPet().name() != null && !req.firstPet().name().isBlank()) {
            Pet pet = new Pet();
            pet.setId(IdGenerator.newId("pet"));
            pet.setOwnerUserId(saved.getId());
            pet.setName(req.firstPet().name().trim());
            pet.setSpecies(req.firstPet().species());
            pet.setBreed(req.firstPet().breed());
            pet.setAge(req.firstPet().age() == null ? "" : req.firstPet().age().trim());
            pet.setNotes("");
            pets.insert(pet);
        }

        return saved;
    }
}

