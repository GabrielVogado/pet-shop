package com.petcare.model;

import jakarta.nosql.Column;
import jakarta.nosql.Entity;
import jakarta.nosql.Id;

/**
 * Notificacao direcionada a um tutor (ex.: cancelamento feito pelo petshop).
 */
@Entity
public class Notificacao {

    @Id
    private String id;

    @Column
    private String userId;

    @Column
    private String petId;

    @Column
    private String petshopId;

    @Column
    private String appointmentId;

    @Column
    private String createdAt;

    @Column
    private String title;

    @Column
    private String message;

    @Column
    private boolean read;

    public Notificacao() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPetId() {
        return petId;
    }

    public void setPetId(String petId) {
        this.petId = petId;
    }

    public String getPetshopId() {
        return petshopId;
    }

    public void setPetshopId(String petshopId) {
        this.petshopId = petshopId;
    }

    public String getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(String appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean getRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }
}
