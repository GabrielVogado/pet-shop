package com.petcare.dto;

import java.util.List;

public record AgendamentoAvailabilityView(
        List<String> availableDates,
        List<String> availableTimes) {
}