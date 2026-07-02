package com.petcare.rest;

import java.util.Map;
import java.util.stream.Collectors;

import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

import io.quarkus.hibernate.validator.runtime.jaxrs.ResteasyReactiveViolationException;

import jakarta.ws.rs.core.Response;

/**
 * Converte falhas de validacao do Bean Validation (@Valid) no mesmo formato
 * {"message": ...} usado pelo {@link ApiExceptionMapper}, para que o frontend
 * exiba a mensagem real em vez do fallback generico "Ocorreu um erro inesperado".
 *
 * <p>Usa {@code @ServerExceptionMapper} (extensao Quarkus REST), que tem
 * precedencia sobre o mapper built-in de validacao, o qual responde com corpo vazio.
 */
public class ValidationExceptionMapper {

    @ServerExceptionMapper
    public Response toResponse(ResteasyReactiveViolationException exception) {
        String message = exception.getConstraintViolations().stream()
                .map(violation -> violation.getMessage())
                .distinct()
                .collect(Collectors.joining(" "));

        if (message.isBlank()) {
            message = "Dados invalidos. Verifique os campos e tente novamente.";
        }

        return Response.status(Response.Status.BAD_REQUEST)
                .entity(Map.of("message", "DIAG:" + message))
                .build();
    }
}

