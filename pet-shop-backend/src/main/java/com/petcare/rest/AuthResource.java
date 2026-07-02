package com.petcare.rest;

import com.petcare.dto.AuthResponse;
import com.petcare.dto.LoginRequest;
import com.petcare.dto.RegisterRequest;
import com.petcare.dto.UserView;
import com.petcare.model.Usuario;
import com.petcare.security.TokenService;
import com.petcare.service.AuthService;

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
public class AuthResource {

    @Inject
    AuthService authService;

    @Inject
    TokenService tokenService;

    @POST
    @Path("/register")
    public Response register(@Valid RegisterRequest request) {
        Usuario usuario = authService.register(request);
        return Response.status(Response.Status.CREATED)
                .entity(UserView.from(usuario))
                .build();
    }

    @POST
    @Path("/login")
    public AuthResponse login(@Valid LoginRequest request) {
        Usuario usuario = authService.login(request.email(), request.password());
        String token = tokenService.generate(usuario);
        return new AuthResponse(token, UserView.from(usuario));
    }
}
