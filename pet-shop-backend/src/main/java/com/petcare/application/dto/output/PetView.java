package com.petcare.application.dto.output;

import com.petcare.application.dto.output.PetView;

import com.petcare.domain.entity.Pet;

public record PetView(
        String id,
        String name,
        String species,
        String breed,
        String age,
        String notes) {

    public static PetView from(Pet p) {
        return new PetView(p.getId(), p.getName(), p.getSpecies(),
                p.getBreed(), p.getAge(), p.getNotes());
    }
}



