package com.petcare.security;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class PasswordServiceTest {

    private final PasswordService service = new PasswordService();

    @Test
    void hashNaoDeveSerIgualAoTextoPuro() {
        String hash = service.hash("segredo123");
        assertNotEquals("segredo123", hash);
        assertTrue(hash.startsWith("$2"), "deve ser um hash BCrypt (modular crypt)");
    }

    @Test
    void verifyAceitaSenhaCorreta() {
        String hash = service.hash("segredo123");
        assertTrue(service.verify("segredo123", hash));
    }

    @Test
    void verifyRejeitaSenhaIncorretaOuNula() {
        String hash = service.hash("segredo123");
        assertFalse(service.verify("errada", hash));
        assertFalse(service.verify(null, hash));
        assertFalse(service.verify("segredo123", null));
    }
}
