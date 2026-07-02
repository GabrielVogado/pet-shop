package com.petcare.service;

import com.petcare.dto.RegisterRequest;
import com.petcare.model.Pet;
import com.petcare.model.Roles;
import com.petcare.model.Usuario;
import com.petcare.repository.PetRepository;
import com.petcare.repository.UsuarioRepository;
import com.petcare.rest.ApiException;
import com.petcare.security.PasswordService;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * Regras de cadastro e autenticacao.
 */
@ApplicationScoped
public class AuthService {

    @Inject
    UsuarioRepository usuarios;

    @Inject
    PetRepository pets;

    @Inject
    PasswordService passwordService;

    public Usuario register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();

        if (usuarios.existsByEmail(email)) {
            throw ApiException.conflict("Este email ja esta cadastrado.");
        }

        boolean owner = Roles.OWNER.equals(req.role());
        if (owner && (req.businessName() == null || req.businessName().isBlank())) {
            throw ApiException.badRequest("Informe a razao social ou nome da loja.");
        }
        if (!owner && (req.phone() == null || req.phone().isBlank())) {
            throw ApiException.badRequest("Informe o telefone do tutor.");
        }
        if (!owner && (req.address() == null || req.address().isBlank())) {
            throw ApiException.badRequest("Informe o endereco do tutor.");
        }

        Usuario usuario = new Usuario();
        usuario.setId(Ids.newId("user"));
        usuario.setRole(req.role());
        usuario.setName(req.name().trim());
        usuario.setEmail(email);
        usuario.setPhone(req.phone() == null ? null : req.phone().trim());
        usuario.setAddress(req.address() == null ? null : req.address().trim());
        usuario.setPasswordHash(passwordService.hash(req.password()));

        if (owner) {
            usuario.setBusinessName(req.businessName().trim());
            usuario.setPetshopId(generateUniquePetshopId(req.businessName()));
        }

        Usuario saved = usuarios.insert(usuario);

        // Cadastro opcional do primeiro pet (apenas tutor).
        if (!owner && req.firstPet() != null
                && req.firstPet().name() != null && !req.firstPet().name().isBlank()) {
            Pet pet = new Pet();
            pet.setId(Ids.newId("pet"));
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

    public Usuario login(String email, String password) {
        Usuario usuario = usuarios.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> ApiException.unauthorized("Email ou senha invalidos."));

        if (!passwordService.verify(password, usuario.getPasswordHash())) {
            throw ApiException.unauthorized("Email ou senha invalidos.");
        }
        return usuario;
    }

    private synchronized String generateUniquePetshopId(String businessName) {
        String base = Ids.slug(businessName);
        String candidate = base;
        int counter = 1;
        while (usuarios.existsByPetshopId(candidate)) {
            candidate = base + "-" + counter;
            counter++;
        }
        return candidate;
    }
}

