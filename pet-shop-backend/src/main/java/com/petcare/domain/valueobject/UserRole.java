package com.petcare.domain.valueobject;

/**
 * Papeis de usuario no sistema PetCare Agenda.
 * Substitui a antiga classe de constantes Roles.java.
 */
public enum UserRole {
    TUTOR("tutor"),
    OWNER("owner");

    private final String value;

    UserRole(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static UserRole fromString(String role) {
        for (UserRole r : UserRole.values()) {
            if (r.value.equalsIgnoreCase(role)) {
                return r;
            }
        }
        throw new IllegalArgumentException("Role invalido: " + role);
    }
}