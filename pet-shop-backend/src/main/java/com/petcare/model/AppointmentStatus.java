package com.petcare.model;

/**
 * Status possiveis de um agendamento.
 */
public enum AppointmentStatus {
    SCHEDULED("Agendado"),
    COMPLETED("Concluido"),
    CANCELLED("Cancelado");

    private final String label;

    AppointmentStatus(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }
}
