package com.generation.sbb.model;

/**
 * Macchina a stati di una prenotazione.
 *
 * Il flusso consentito è:
 *
 *   PENDING ──► CHECKED_IN ──► CHECKED_OUT ──► COMPLETE
 *      │
 *      └──────► CANCELED
 *
 * - PENDING:     stato iniziale assegnato automaticamente alla creazione.
 *                La prenotazione è in attesa di essere accettata o rifiutata.
 *
 * - CHECKED_IN:  la prenotazione è stata accettata e l'ospite è entrato.
 *                La camera passa a OCCUPIED.
 *
 * - CANCELED:    la prenotazione è stata rifiutata da PENDING.
 *                La camera non cambia stato (non era mai stata occupata).
 *
 * - CHECKED_OUT: l'ospite è uscito. Transizione consentita solo dal giorno
 *                di check-out in poi, per evitare checkout prematuri.
 *                La camera passa a TO_CLEAN.
 *
 * - COMPLETE:    le pulizie sono state eseguite. Stato finale della prenotazione.
 *                La camera torna AVAILABLE e si aggiorna lastCleaned.
 *
 * Usiamo un enum invece di una String libera perché gli stati sono un insieme
 * chiuso e mutuamente esclusivi: l'enum impedisce valori invalidi a compile-time
 * e rende esplicite le transizioni nel BookingService.
 * @Enumerated(EnumType.STRING) su Booking fa sì che Hibernate salvi il nome
 * ("PENDING", "CHECKED_IN"...) invece dell'indice numerico, rendendo il DB leggibile
 * e robusto ai riordini futuri dell'enum.
 */
public enum BookingStatus {
    PENDING,
    CHECKED_IN,
    CHECKED_OUT,
    COMPLETE,
    CANCELED
}
