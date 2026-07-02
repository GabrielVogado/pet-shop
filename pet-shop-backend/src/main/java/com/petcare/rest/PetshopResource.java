package com.petcare.rest;

import java.util.List;

import com.petcare.dto.PetshopView;
import com.petcare.repository.UsuarioRepository;

import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

/**
 * Lista publica de petshops disponiveis para o tutor escolher ao agendar.
 */
@Path("/api/petshops")
@Produces(MediaType.APPLICATION_JSON)
@PermitAll
public class PetshopResource {

    @Inject
    UsuarioRepository usuarios;

    @GET
    public List<PetshopView> list() {
        return usuarios.findPetshops().stream()
            .map(u -> new PetshopView(u.getPetshopId(),
                u.getName() != null && !u.getName().isBlank() ? u.getName() : u.getPetshopId()))
                .toList();
    }
}
