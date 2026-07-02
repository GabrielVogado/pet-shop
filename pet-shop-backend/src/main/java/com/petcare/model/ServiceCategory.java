package com.petcare.model;

/**
 * Categorias de servico oferecidas pelos petshops.
 */
public enum ServiceCategory {
    BATH("bath", "Banho"),
    VACCINE("vaccine", "Vacina");

    private final String code;
    private final String label;

    ServiceCategory(String code, String label) {
        this.code = code;
        this.label = label;
    }

    public String code() {
        return code;
    }

    public String label() {
        return label;
    }

    public static ServiceCategory fromCode(String code) {
        for (ServiceCategory c : values()) {
            if (c.code.equals(code)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Categoria invalida: " + code);
    }
}
