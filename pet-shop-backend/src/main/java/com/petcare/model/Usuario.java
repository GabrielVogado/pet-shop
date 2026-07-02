package com.petcare.model;

import jakarta.nosql.Column;
import jakarta.nosql.Entity;
import jakarta.nosql.Id;

/**
 * Usuario do sistema. Pode ter role "tutor" ou "owner".
 * A senha NUNCA e armazenada em texto puro: apenas o hash BCrypt.
 */
@Entity
public class Usuario {

    @Id
    private String id;

    @Column
    private String name;

    @Column
    private String email;

    @Column
    private String phone;

    /** Endereco do tutor para atendimento/coleta. */
    @Column
    private String address;

    /** Hash BCrypt da senha. */
    @Column
    private String passwordHash;

    /** "tutor" ou "owner". */
    @Column
    private String role;

    /** Apenas para owner. */
    @Column
    private String businessName;

    /** Apenas para owner: identifica o estabelecimento (multi-tenant). */
    @Column
    private String petshopId;

    public Usuario() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getPetshopId() {
        return petshopId;
    }

    public void setPetshopId(String petshopId) {
        this.petshopId = petshopId;
    }
}
