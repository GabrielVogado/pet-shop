package com.petcare.repository;

import java.util.List;
import java.util.Optional;

import com.petcare.model.Pet;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.nosql.Template;

/**
 * Camada de repositorio para Pet, sobre o Template do Jakarta NoSQL.
 */
@ApplicationScoped
public class PetRepository {

    @Inject
    Template template;

    public Pet insert(Pet pet) {
        return template.insert(pet);
    }

    public Pet update(Pet pet) {
        return template.update(pet);
    }

    public Optional<Pet> findById(String id) {
        return template.find(Pet.class, id);
    }

    public List<Pet> findByOwnerUserId(String ownerUserId) {
        return template.select(Pet.class)
                .where("ownerUserId").eq(ownerUserId)
                .result();
    }
}
