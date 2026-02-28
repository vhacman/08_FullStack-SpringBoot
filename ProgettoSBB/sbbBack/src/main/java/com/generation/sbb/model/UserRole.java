package com.generation.sbb.model;

/**
 * Ruoli disponibili per gli utenti del sistema.
 * Per ora non limitano le API (non è stato implementato Spring Security),
 * ma sono presenti nel modello per una futura gestione degli accessi.
 * Salvato come stringa nel DB (@Enumerated(STRING) su User) per leggibilità.
 */
public enum UserRole {

    ADMIN,
    RECEPTIONIST;

}
