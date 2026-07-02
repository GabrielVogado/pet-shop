package com.petcare.dto;

import com.petcare.model.Usuario;

/**
 * Visao publica do usuario (NUNCA inclui senha/hash).
 */
public record UserView(
        String id,
        String name,
        String email,
        String phone,
    String address,
        String role,
        String businessName,
        String petshopId) {

    public static UserView from(Usuario u) {
        return new UserView(
            u.getId(), u.getName(), u.getEmail(), u.getPhone(), u.getAddress(),
                u.getRole(), u.getBusinessName(), u.getPetshopId());
    }
}
