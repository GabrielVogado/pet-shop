package com.petcare.infrastructure.web.controller;

import java.util.List;

import com.petcare.application.dto.input.PetRequest;
import com.petcare.application.dto.output.PetView;
import com.petcare.application.service.PetService;

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
public class PetController {

    @Inject
    PetService petService;

    @Inject
    JsonWebToken jwt;

    @GET
    public List<PetView> list() {
        return petService.listByUser(jwt.getSubject()).stream()
                .map(PetView::from)
                .toList();
    }

    @POST
    public Response create(@Valid PetRequest request) {
        var saved = petService.create(jwt.getSubject(), request);
        return Response.status(Response.Status.CREATED)
                .entity(PetView.from(saved))
                .build();
    }

    @PUT
    @Path("/{id}")
    public PetView update(@PathParam("id") String id, @Valid PetRequest request) {
        var updated = petService.update(jwt.getSubject(), id, request);
        return PetView.from(updated);
    }

    @GET
    @Path("/{id}")
    public PetView getPet(@PathParam("id") String id) {
        var pet = petService.getById(jwt.getSubject(), id);
        return PetView.from(pet);
    }
}
