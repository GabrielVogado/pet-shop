package com.petcare.application.service;

import com.petcare.application.dto.input.RegisterRequest;
import com.petcare.infrastructure.persistence.MongoPetRepository;
import com.petcare.infrastructure.persistence.MongoUserRepository;
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
    MongoUserRepository usuarios;

    @Inject
    MongoPetRepository pets;

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
        if (owner && usuarios.existsOwner()) {
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

        Usuario saved;
        try {
            saved = usuarios.insert(usuario);
        } catch (RuntimeException e) {
            if (isDuplicateKeyError(e)) {
                throw ApiException.conflict("Ja existe um petshop cadastrado no sistema.");
            }
            throw e;
        }

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

    /**
     * Verifica se a exceção (ou sua cadeia de causas) é um erro E11000
     * de chave duplicada do MongoDB, gerado pelo índice único parcial
     * {@code idx_usuario_role_owner_unique} (criado em MIG-001).
     */
    private boolean isDuplicateKeyError(Throwable e) {
        Throwable current = e;
        while (current != null) {
            String msg = current.getMessage();
            if (msg != null && (msg.contains("E11000") || msg.contains("duplicate key"))) {
                return true;
            }
            current = current.getCause();
        }
        return false;
    }
}


