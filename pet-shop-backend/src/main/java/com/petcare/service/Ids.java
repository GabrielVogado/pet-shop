package com.petcare.service;

import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;

/**
 * Utilitarios de geracao de identificadores e slugs.
 */
public final class Ids {

    private Ids() {
    }

    public static String newId(String prefix) {
        return prefix + "-" + UUID.randomUUID();
    }

    /** Gera um slug seguro (a-z0-9 e hifens) a partir de um texto livre. */
    public static String slug(String value) {
        if (value == null || value.isBlank()) {
            return "petshop";
        }
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-+)|(-+$)", "");
        if (normalized.length() > 32) {
            normalized = normalized.substring(0, 32);
        }
        return normalized.isBlank() ? "petshop" : normalized;
    }
}
