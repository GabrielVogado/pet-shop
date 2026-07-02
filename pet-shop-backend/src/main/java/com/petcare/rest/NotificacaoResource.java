package com.petcare.rest;

import java.util.List;

import com.petcare.dto.NotificacaoView;
import com.petcare.repository.NotificacaoRepository;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api/notifications")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("tutor")
public class NotificacaoResource {

    @Inject
    NotificacaoRepository notificacoes;

    @Inject
    JsonWebToken jwt;

    @GET
    public List<NotificacaoView> list() {
        return notificacoes.findByUserId(jwt.getSubject()).stream()
                .map(NotificacaoView::from)
                .toList();
    }
}
