package com.petcare.repository;

import java.util.List;
import java.util.Optional;

import com.petcare.model.Usuario;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.nosql.Template;

/**
 * Camada de repositorio para Usuario, sobre o Template do Jakarta NoSQL.
 */
@ApplicationScoped
public class UsuarioRepository {

    @Inject
    Template template;

    public Usuario insert(Usuario usuario) {
        return template.insert(usuario);
    }

    public Usuario update(Usuario usuario) {
        return template.update(usuario);
    }

    public Optional<Usuario> findById(String id) {
        return template.find(Usuario.class, id);
    }

    public Optional<Usuario> findByEmail(String email) {
        return template.select(Usuario.class)
                .where("email").eq(email)
                .singleResult();
    }

    public boolean existsByEmail(String email) {
        return findByEmail(email).isPresent();
    }

    public boolean existsByPetshopId(String petshopId) {
        return template.select(Usuario.class)
                .where("petshopId").eq(petshopId)
                .singleResult()
                .isPresent();
    }

    public List<Usuario> findPetshops() { return template.select(Usuario.class).where("role").eq("owner").result(); }

    public List<Usuario> findAll() {
        return template.select(Usuario.class).result();
    }
}

