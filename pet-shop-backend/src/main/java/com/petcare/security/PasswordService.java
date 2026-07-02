package com.petcare.security;

import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;
import org.wildfly.security.password.PasswordFactory;
import org.wildfly.security.password.WildFlyElytronPasswordProvider;
import org.wildfly.security.password.interfaces.BCryptPassword;
import org.wildfly.security.password.util.ModularCrypt;

/**
 * Servico de hashing e verificacao de senhas com BCrypt.
 * Corrige a vulnerabilidade do MVP, que guardava senha em texto puro.
 */
@ApplicationScoped
public class PasswordService {

    /** Gera o hash BCrypt (formato Modular Crypt) da senha em texto puro. */
    public String hash(String plainPassword) {
        return BcryptUtil.bcryptHash(plainPassword);
    }

    /** Verifica a senha informada contra o hash BCrypt armazenado. */
    public boolean verify(String plainPassword, String storedHash) {
        if (plainPassword == null || storedHash == null || storedHash.isBlank()) {
            return false;
        }
        try {
            var decoded = ModularCrypt.decode(storedHash);
            PasswordFactory factory = PasswordFactory.getInstance(
                    BCryptPassword.ALGORITHM_BCRYPT, new WildFlyElytronPasswordProvider());
            var restored = factory.translate(decoded);
            return factory.verify(restored, plainPassword.toCharArray());
        } catch (Exception e) {
            return false;
        }
    }
}
