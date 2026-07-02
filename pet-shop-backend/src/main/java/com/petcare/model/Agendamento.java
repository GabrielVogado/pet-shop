package com.petcare.model;

import jakarta.nosql.Column;
import jakarta.nosql.Entity;
import jakarta.nosql.Id;

/**
 * Agendamento de servico (banho ou vacina) feito por um tutor para um pet,
 * vinculado a um petshop (multi-tenant via petshopId).
 */
@Entity
public class Agendamento {

    @Id
    private String id;

    @Column
    private String userId;

    @Column
    private String tutor;

    @Column
    private String tutorAddress;

    @Column
    private String petshopId;

    @Column
    private String petId;

    @Column
    private String pet;

    /** ISO-8601 do instante do agendamento. */
    @Column
    private String dateTime;

    /** "Banho" ou "Vacina". */
    @Column
    private String type;

    @Column
    private String serviceId;

    @Column
    private String service;

    @Column
    private Integer durationMinutes;

    /** "Agendado", "Concluido" ou "Cancelado". */
    @Column
    private String status;

    /** "petshop" quando o cancelamento foi feito pelo dono. */
    @Column
    private String canceledBy;

    public Agendamento() {
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

    public String getTutor() {
        return tutor;
    }

    public void setTutor(String tutor) {
        this.tutor = tutor;
    }

    public String getTutorAddress() {
        return tutorAddress;
    }

    public void setTutorAddress(String tutorAddress) {
        this.tutorAddress = tutorAddress;
    }

    public String getPetshopId() {
        return petshopId;
    }

    public void setPetshopId(String petshopId) {
        this.petshopId = petshopId;
    }

    public String getPetId() {
        return petId;
    }

    public void setPetId(String petId) {
        this.petId = petId;
    }

    public String getPet() {
        return pet;
    }

    public void setPet(String pet) {
        this.pet = pet;
    }

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCanceledBy() {
        return canceledBy;
    }

    public void setCanceledBy(String canceledBy) {
        this.canceledBy = canceledBy;
    }
}
