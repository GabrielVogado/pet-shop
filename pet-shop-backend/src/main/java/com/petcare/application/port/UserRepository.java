package com.petcare.application.port;

import com.petcare.domain.entity.Usuario;
import java.util.List;
import java.util.Optional;

public interface UserRepository {
    Usuario insert(Usuario usuario);
    Usuario update(Usuario usuario);
    Optional<Usuario> findById(String id);
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findAll();
}
