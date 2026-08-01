package com.petcare.domain.exception;

/**
 * Excecao base para erros de dominio.
 */
public class DomainException extends RuntimeException {
    public DomainException(String message) {
        super(message);
    }
    public DomainException(String message, Throwable cause) {
        super(message, cause);
    }
}