package com.petcare.dto;

public record AuthResponse(String token, UserView user) {
}
