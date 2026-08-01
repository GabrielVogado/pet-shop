package com.petcare.application.service;

import com.petcare.application.port.UserRepository;
import com.petcare.domain.entity.Usuario;
import com.petcare.infrastructure.security.BCryptPasswordEncoder;
import com.petcare.infrastructure.web.exception.ApiException;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

/**
 * Serviço de autenticação (login).
 * Extraído de AuthService.login() — SRP: apenas validação de credenciais.
 */
@ApplicationScoped
public class AuthenticationService {

    @Inject
    UserRepository usuarios;

    @Inject
    BCryptPasswordEncoder passwordEncoder;

    public Usuario login(String email, String password) {
        Usuario usuario = usuarios.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> ApiException.unauthorized("Email ou senha invalidos."));

        if (!passwordEncoder.verify(password, usuario.getPasswordHash())) {
            throw ApiException.unauthorized("Email ou senha invalidos.");
        }
        return usuario;
    }
}
