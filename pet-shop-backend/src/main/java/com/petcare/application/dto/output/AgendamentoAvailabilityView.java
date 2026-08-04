package com.petcare.application.dto.output;

import com.petcare.application.dto.output.AgendamentoAvailabilityView;

import java.util.List;

public record AgendamentoAvailabilityView(
        List<String> availableDates,
        List<String> availableTimes) {
}

