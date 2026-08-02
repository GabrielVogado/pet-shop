package com.petcare.application.service;

import com.petcare.application.dto.input.PetRequest;
import com.petcare.domain.entity.Pet;
import com.petcare.infrastructure.persistence.MongoPetRepository;
import com.petcare.infrastructure.web.exception.ApiException;
import com.petcare.shared.util.IdGenerator;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

/**
 * Serviço de gerenciamento de pets.
 * Extraído de PetController — SRP: lógica de negócio isolada do controller.
 */
@ApplicationScoped
public class PetService {

    @Inject
    MongoPetRepository pets;

    public List<Pet> listByUser(String userId) {
        return pets.findByOwnerUserId(userId);
    }

    public Pet create(String userId, PetRequest request) {
        Pet pet = new Pet();
        pet.setId(IdGenerator.newId("pet"));
        pet.setOwnerUserId(userId);
        pet.setName(request.name().trim());
        pet.setSpecies(request.species());
        pet.setBreed(request.breed());
        pet.setAge(request.age());
        pet.setNotes(request.notes());
        return pets.insert(pet);
    }

    public Pet update(String userId, String petId, PetRequest request) {
        Pet current = pets.findById(petId)
                .orElseThrow(() -> ApiException.notFound("Pet nao encontrado."));

        if (!userId.equals(current.getOwnerUserId())) {
            throw ApiException.forbidden("Voce nao pode editar este pet.");
        }

        current.setName(request.name().trim());
        current.setSpecies(request.species());
        current.setBreed(request.breed());
        current.setAge(request.age());
        current.setNotes(request.notes());

        return pets.update(current);
    }

    public Pet getById(String userId, String petId) {
        Pet pet = pets.findById(petId)
                .orElseThrow(() -> ApiException.notFound("Pet nao encontrado."));

        if (!userId.equals(pet.getOwnerUserId())) {
            throw ApiException.forbidden("Voce nao pode acessar este pet.");
        }

        return pet;
    }
}
