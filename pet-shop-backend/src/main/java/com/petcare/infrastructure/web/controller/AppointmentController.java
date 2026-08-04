package com.petcare.infrastructure.web.controller;

import java.util.List;

import com.petcare.application.dto.output.AgendamentoAvailabilityView;
import com.petcare.application.dto.output.AgendamentoView;
import com.petcare.application.dto.input.AgendamentoRequest;
import com.petcare.application.service.AppointmentService;
import com.petcare.domain.entity.Usuario;
import com.petcare.domain.valueobject.UserRole;
import com.petcare.infrastructure.persistence.MongoPetRepository;
import com.petcare.infrastructure.persistence.MongoUserRepository;
import com.petcare.infrastructure.web.exception.ApiException;

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
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api/agendamentos")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AppointmentController {

    @Inject
    AppointmentService service;

    @Inject
    MongoUserRepository usuarios;

    @Inject
    MongoPetRepository pets;

    @Inject
    JsonWebToken jwt;

    /**
     * Tutor recebe seus proprios agendamentos (filtravel por petId).
     * Owner recebe a agenda do seu petshop.
     */
    @GET
    @RolesAllowed({ "tutor", "owner" })
    public List<AgendamentoView> list(@QueryParam("petId") String petId) {
        if (isOwner()) {
            return service.listForPetshop(currentPetshopId()).stream()
                    .map(appointment -> AgendamentoView.from(
                            appointment,
                            usuarios.findById(appointment.getUserId()).orElse(null),
                            pets.findById(appointment.getPetId()).orElse(null)))
                    .toList();
        }
        return service.listForTutor(jwt.getSubject(), petId).stream()
            .map(AgendamentoView::from)
            .toList();
    }

    @POST
    @RolesAllowed("tutor")
    public Response create(@Valid AgendamentoRequest request) {
        Usuario tutor = currentUser();
        var created = service.create(tutor, request);
        return Response.status(Response.Status.CREATED)
            .entity(AgendamentoView.from(created, tutor, pets.findById(created.getPetId()).orElse(null)))
                .build();
    }

    /**
     * Retorna agenda de dias e horarios disponiveis de um petshop para um servico.
     */
    @GET
    @Path("/availability")
    @RolesAllowed("tutor")
    public AgendamentoAvailabilityView availability(
            @QueryParam("petshopId") String petshopId,
            @QueryParam("serviceId") String serviceId,
            @QueryParam("date") String date) {
        return service.availability(petshopId, serviceId, date);
    }

    /** Cancelamento: tutor cancela o proprio; owner cancela do seu petshop. */
    @PUT
    @Path("/{id}/cancel")
    @RolesAllowed({ "tutor", "owner" })
    public AgendamentoView cancel(@PathParam("id") String id) {
        if (isOwner()) {
            var updated = service.cancelByPetshop(currentPetshopId(), id);
            return AgendamentoView.from(
                    updated,
                    usuarios.findById(updated.getUserId()).orElse(null),
                    pets.findById(updated.getPetId()).orElse(null));
        }
        var updated = service.cancelByTutor(jwt.getSubject(), id);
        return AgendamentoView.from(
                updated,
                usuarios.findById(updated.getUserId()).orElse(null),
                pets.findById(updated.getPetId()).orElse(null));
    }

    private boolean isOwner() {
        return jwt.getGroups() != null && jwt.getGroups().contains(UserRole.OWNER.getValue());
    }

    private Usuario currentUser() {
        return usuarios.findById(jwt.getSubject())
                .orElseThrow(() -> ApiException.unauthorized("Sessao invalida."));
    }

    private String currentPetshopId() {
        Object claim = jwt.getClaim("petshopId");
        if (claim != null) {
            return claim.toString();
        }
        return currentUser().getPetshopId();
    }
}
