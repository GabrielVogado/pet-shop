package com.petcare.infrastructure.web.controller;

import java.util.List;

import com.petcare.application.dto.output.NotificacaoView;
import com.petcare.infrastructure.persistence.MongoNotificationRepository;

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
public class NotificationController {

    @Inject
    MongoNotificationRepository notificacoes;

    @Inject
    JsonWebToken jwt;

    @GET
    public List<NotificacaoView> list() {
        return notificacoes.findByUserId(jwt.getSubject()).stream()
                .map(NotificacaoView::from)
                .toList();
    }
}





