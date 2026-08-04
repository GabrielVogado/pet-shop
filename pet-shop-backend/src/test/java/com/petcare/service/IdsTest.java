package com.petcare.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class IdsTest {

    @Test
    void newIdUsaPrefixoEhUnico() {
        String a = IdGenerator.newId("user");
        String b = IdGenerator.newId("user");
        assertTrue(a.startsWith("user-"));
        assertNotEquals(a, b);
    }

    @Test
    void slugRemoveAcentosECaracteresEspeciais() {
        assertEquals("higgins-petshop", IdGenerator.slug("Higgins  Petshop!"));
        assertEquals("pet-prime", IdGenerator.slug("Pét Prime"));
    }

    @Test
    void slugVazioUsaPadrao() {
        assertEquals("petshop", IdGenerator.slug("   "));
        assertEquals("petshop", IdGenerator.slug(null));
    }
}

