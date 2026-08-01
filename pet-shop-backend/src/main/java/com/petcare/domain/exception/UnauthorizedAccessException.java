package com.petcare.domain.exception;

/**
 * Lancada quando um usuario tenta acessar/modificar um recurso que nao lhe pertence.
 * Mitiga BOLA/IDOR (Broken Object Level Authorization).
 */
public class UnauthorizedAccessException extends DomainException {
    public UnauthorizedAccessException(String message) {
        super(message);
    }
}