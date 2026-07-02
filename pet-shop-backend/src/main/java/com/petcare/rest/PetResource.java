package com.petcare.rest;

import java.util.List;

import com.petcare.dto.PetRequest;
import com.petcare.dto.PetView;
import com.petcare.model.Pet;
import com.petcare.repository.PetRepository;
import com.petcare.service.Ids;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api/pets")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("tutor")
public class PetResource {

    @Inject
    PetRepository pets;

    @Inject
    JsonWebToken jwt;

    @GET
    public List<PetView> list() {
        return pets.findByOwnerUserId(jwt.getSubject()).stream()
                .map(PetView::from)
                .toList();
    }

    @POST
    public Response create(@Valid PetRequest request) {
        Pet pet = new Pet();
        pet.setId(Ids.newId("pet"));
        pet.setOwnerUserId(jwt.getSubject());
        pet.setName(request.name().trim());
        pet.setSpecies(request.species());
        pet.setBreed(request.breed());
        pet.setAge(request.age());
        pet.setNotes(request.notes());
        Pet saved = pets.insert(pet);
        return Response.status(Response.Status.CREATED)
                .entity(PetView.from(saved))
                .build();
    }

    @PUT
    @Path("/{id}")
    public PetView update(@PathParam("id") String id, @Valid PetRequest request) {
        Pet current = pets.findById(id)
                .orElseThrow(() -> ApiException.notFound("Pet nao encontrado."));

        if (!jwt.getSubject().equals(current.getOwnerUserId())) {
            throw ApiException.forbidden("Voce nao pode editar este pet.");
        }

        current.setName(request.name().trim());
        current.setSpecies(request.species());
        current.setBreed(request.breed());
        current.setAge(request.age());
        current.setNotes(request.notes());

        return PetView.from(pets.update(current));
    }
}
