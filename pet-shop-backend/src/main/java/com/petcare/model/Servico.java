package com.petcare.model;

import java.util.List;

import jakarta.nosql.Column;
import jakarta.nosql.Entity;
import jakarta.nosql.Id;

/**
 * Servico/pacote oferecido por um petshop (escopado pelo petshopId).
 */
@Entity
public class Servico {

    @Id
    private String id;

    @Column
    private String petshopId;

    @Column
    private String name;

    /** "bath" ou "vaccine". */
    @Column
    private String category;

    @Column
    private String duration;

    @Column
    private double price;

    @Column
    private String description;

    @Column
    private List<String> features;

    public Servico() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPetshopId() {
        return petshopId;
    }

    public void setPetshopId(String petshopId) {
        this.petshopId = petshopId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }
}
