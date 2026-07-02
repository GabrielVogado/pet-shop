package com.petcare;

import jakarta.ws.rs.core.Application;
import org.eclipse.microprofile.openapi.annotations.OpenAPIDefinition;
import org.eclipse.microprofile.openapi.annotations.enums.SecuritySchemeType;
import org.eclipse.microprofile.openapi.annotations.info.Info;
import org.eclipse.microprofile.openapi.annotations.security.SecurityScheme;

/**
 * Configuracao da aplicacao JAX-RS e da especificacao OpenAPI.
 * Declara o esquema de seguranca Bearer JWT para o Swagger UI.
 */
@OpenAPIDefinition(
        info = @Info(title = "PetCare Agenda API", version = "1.0.0",
                description = "API de agendamento de banhos e vacinas para pets"))
@SecurityScheme(
        securitySchemeName = "jwt",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT")
public class PetCareApplication extends Application {
}
