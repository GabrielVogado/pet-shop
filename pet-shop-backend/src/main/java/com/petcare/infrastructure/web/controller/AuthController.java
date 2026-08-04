package com.petcare.infrastructure.web.controller;

import com.petcare.application.dto.output.AuthResponse;
import com.petcare.application.dto.output.UserView;
import com.petcare.application.dto.input.LoginRequest;
import com.petcare.application.dto.input.RegisterRequest;
import com.petcare.application.service.AuthenticationService;
import com.petcare.application.service.RegistrationService;
import com.petcare.domain.entity.Usuario;
import com.petcare.infrastructure.security.JwtTokenProvider;

import io.smallrye.faulttolerance.api.RateLimit;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
@PermitAll
public class AuthController {

    @Inject
    RegistrationService registration;

    @Inject
    AuthenticationService authentication;

    @Inject
    JwtTokenProvider tokenProvider;

    @POST
    @Path("/register")
    public Response register(@Valid RegisterRequest request) {
        Usuario usuario = registration.register(request);
        return Response.status(Response.Status.CREATED)
                .entity(UserView.from(usuario))
                .build();
    }

    @POST
    @Path("/login")
    @RateLimit(value = 5, window = 1, windowUnit = java.time.temporal.ChronoUnit.MINUTES)
    public AuthResponse login(@Valid LoginRequest request) {
        Usuario usuario = authentication.login(request.email(), request.password());
        String token = tokenProvider.generate(usuario);
        return new AuthResponse(token, UserView.from(usuario));
    }
}
