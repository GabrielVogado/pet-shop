package com.petcare.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.petcare.dto.RegisterRequest;
import com.petcare.model.Usuario;
import com.petcare.repository.PetRepository;
import com.petcare.repository.UsuarioRepository;
import com.petcare.rest.ApiException;
import com.petcare.security.PasswordService;

class AuthServiceTest {

    private AuthService service;
    private UsuarioRepository usuarios;
    private PasswordService passwordService;

    @BeforeEach
    void setUp() {
        service = new AuthService();
        usuarios = mock(UsuarioRepository.class);
        passwordService = mock(PasswordService.class);

        service.usuarios = usuarios;
        service.pets = mock(PetRepository.class);
        service.passwordService = passwordService;
    }

    @Test
    void registerOwnerUsaIdentificadorFixoDePetshop() {
        RegisterRequest request = new RegisterRequest(
                "owner",
                "Carlos Dono",
                "owner@example.com",
                "11999999999",
                null,
                "123456",
                "Pet Shop Central",
                null);

        when(usuarios.existsByEmail("owner@example.com")).thenReturn(false);
        when(usuarios.existsOwner()).thenReturn(false);
        when(passwordService.hash("123456")).thenReturn("hash");
        when(usuarios.insert(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Usuario created = service.register(request);

        assertEquals(AuthService.SINGLE_PETSHOP_ID, created.getPetshopId());
        assertEquals("Pet Shop Central", created.getBusinessName());
    }

    @Test
    void registerOwnerBloqueiaQuandoJaExistePetshopCadastrado() {
        RegisterRequest request = new RegisterRequest(
                "owner",
                "Carlos Dono",
                "owner@example.com",
                "11999999999",
                null,
                "123456",
                "Pet Shop Central",
                null);

        when(usuarios.existsByEmail("owner@example.com")).thenReturn(false);
        when(usuarios.existsOwner()).thenReturn(true);

        ApiException ex = assertThrows(ApiException.class, () -> service.register(request));

        assertEquals(409, ex.getStatus());
        assertEquals("Ja existe um petshop cadastrado no sistema.", ex.getMessage());
        verify(usuarios, never()).insert(any(Usuario.class));
    }
}
