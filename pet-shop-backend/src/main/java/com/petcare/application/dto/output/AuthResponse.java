package com.petcare.application.dto.output;

import com.petcare.application.dto.output.UserView;

import com.petcare.application.dto.output.AuthResponse;

public record AuthResponse(String token, UserView user) {
}


