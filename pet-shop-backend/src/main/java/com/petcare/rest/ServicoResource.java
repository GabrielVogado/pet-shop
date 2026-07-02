package com.petcare.rest;

import java.util.List;

import com.petcare.dto.CatalogView;
import com.petcare.dto.ServicoRequest;
import com.petcare.dto.ServicoView;
import com.petcare.model.ServiceCategory;
import com.petcare.model.Servico;
import com.petcare.service.ServicoService;
import com.petcare.service.ServiceCatalogBroadcaster;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.sse.Sse;
import jakarta.ws.rs.sse.SseEventSink;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api/servicos")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ServicoResource {

    @Inject
    ServicoService service;

    @Inject
    ServiceCatalogBroadcaster broadcaster;

    @Inject
    JsonWebToken jwt;

    /** Owner cadastra um servico/pacote na propria loja. */
    @POST
    @RolesAllowed("owner")
    public Response create(@Valid ServicoRequest request, @Context Sse sse) {
        String petshopId = currentPetshopId();
        var created = service.create(petshopId, request);
        broadcaster.broadcast(sse, ServicoView.from(created), "ADDED", petshopId);
        return Response.status(Response.Status.CREATED)
                .entity(ServicoView.from(created))
                .build();
    }

    /** Owner lista os servicos da propria loja (gestao). */
    @GET
    @RolesAllowed("owner")
    public List<ServicoView> listOwn() {
        return service.listByPetshop(currentPetshopId()).stream()
                .map(ServicoView::from)
                .toList();
    }

    /** Owner remove um servico da propria loja. */
    @DELETE
    @Path("/{id}")
    @RolesAllowed("owner")
    public Response delete(@PathParam("id") String id, @Context Sse sse) {
        String petshopId = currentPetshopId();
        Servico removed = service.delete(petshopId, id);
        broadcaster.broadcast(sse, ServicoView.from(removed), "REMOVED", petshopId);
        return Response.noContent().build();
    }

    /** Catalogo publico de um petshop (consumido pelo tutor ao agendar). */
    @GET
    @Path("/catalogo")
    @PermitAll
    public CatalogView catalogo(@QueryParam("petshopId") String petshopId) {
        if (petshopId == null || petshopId.isBlank()) {
            throw ApiException.badRequest("Informe o petshopId.");
        }
        List<ServicoView> all = service.listByPetshop(petshopId).stream()
                .map(ServicoView::from)
                .toList();
        return new CatalogView(
                all.stream().filter(s -> ServiceCategory.BATH.code().equals(s.category())).toList(),
                all.stream().filter(s -> ServiceCategory.VACCINE.code().equals(s.category())).toList());
    }

    /** Stream SSE de atualizacoes do catalogo (Feature 12). */
    @GET
    @Path("/catalogo/stream")
    @Produces("text/event-stream")
    @PermitAll
    public void stream(@QueryParam("petshopId") String petshopId, @Context SseEventSink sink) {
        if (petshopId == null || petshopId.isBlank()) {
            sink.close();
            return;
        }
        broadcaster.register(sink, petshopId);
    }

    private String currentPetshopId() {
        Object claim = jwt.getClaim("petshopId");
        if (claim == null) {
            throw ApiException.forbidden("Usuario owner sem petshop associado.");
        }
        return claim.toString();
    }
}