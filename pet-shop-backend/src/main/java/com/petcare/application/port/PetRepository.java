package com.petcare.application.port;

import com.petcare.domain.entity.Pet;
import java.util.List;
import java.util.Optional;

public interface PetRepository {
    Pet insert(Pet pet);
    Pet update(Pet pet);
    Optional<Pet> findById(String id);
    List<Pet> findByUserId(String userId);
    void delete(String id);
}


