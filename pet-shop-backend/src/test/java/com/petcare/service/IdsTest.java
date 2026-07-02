package com.petcare.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class IdsTest {

    @Test
    void newIdUsaPrefixoEhUnico() {
        String a = Ids.newId("user");
        String b = Ids.newId("user");
        assertTrue(a.startsWith("user-"));
        assertNotEquals(a, b);
    }

    @Test
    void slugRemoveAcentosECaracteresEspeciais() {
        assertEquals("higgins-petshop", Ids.slug("Higgins  Petshop!"));
        assertEquals("pet-prime", Ids.slug("Pét Prime"));
    }

    @Test
    void slugVazioUsaPadrao() {
        assertEquals("petshop", Ids.slug("   "));
        assertEquals("petshop", Ids.slug(null));
    }
}
