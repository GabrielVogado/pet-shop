package com.petcare.rest;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 * Catalogo publico de servicos (banhos e vacinas).
 */
@Path("/api/services")
@PermitAll
public class ServiceResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response catalog() {
        try (InputStream in = getClass().getClassLoader().getResourceAsStream("services.json")) {
            if (in == null) {
                throw ApiException.notFound("Catalogo de servicos indisponivel.");
            }
            String json = new String(in.readAllBytes(), StandardCharsets.UTF_8);
            return Response.ok(json).build();
        } catch (java.io.IOException e) {
            throw new ApiException(500, "Falha ao ler o catalogo de servicos.");
        }
    }
}
