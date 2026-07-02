package com.petcare.security;

import java.time.Duration;
import java.util.Set;

import com.petcare.model.Usuario;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * Emissao de tokens JWT assinados com RSA (RS256).
 * A chave privada vem de smallrye.jwt.sign.key.location (privateKey.pem).
 */
@ApplicationScoped
public class TokenService {

    @ConfigProperty(name = "mp.jwt.verify.issuer")
    String issuer;

    @ConfigProperty(name = "petcare.jwt.duration", defaultValue = "3600")
    long durationSeconds;

    public String generate(Usuario usuario) {
        var builder = Jwt.issuer(issuer)
                .upn(usuario.getEmail())
                .subject(usuario.getId())
                .groups(Set.of(usuario.getRole()))
                .claim("name", usuario.getName())
                .claim("role", usuario.getRole());

        if (usuario.getPetshopId() != null) {
            builder = builder.claim("petshopId", usuario.getPetshopId());
        }

        return builder.expiresIn(Duration.ofSeconds(durationSeconds)).sign();
    }
}
