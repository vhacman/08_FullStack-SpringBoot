package com.generation.sbb.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Prenotazione che lega un ospite (Guest) a una camera (Room) per un dato periodo.
 * Lo stato segue una macchina a stati rigida definita in BookingStatus:
 * non è modificabile direttamente, solo tramite i metodi di BookingService.
 * Ogni transizione aggiorna anche lo stato della camera associata (RoomStatus).
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "guest_id")
    private Guest guest;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    private LocalDate checkIn;

    private LocalDate checkOut;

    @Min(value=0, message="Price cannot be negative")
    private int price;

    private String notes;

    // Usiamo @Enumerated(STRING) per salvare il nome dell'enum nel DB ("PENDING",
    // "CHECKED_IN"...) invece dell'indice numerico (0, 1, 2...).
    // Con ORDINAL, aggiungere o riordinare valori nell'enum corromperebbe i dati
    // già salvati. Con STRING il DB rimane leggibile e robusto.
    // Il default PENDING viene assegnato alla creazione; il BookingService
    // lo garantisce anche quando il DTO arriva senza status valorizzato.
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    // Il campo "cleaned" è stato rimosso: lo stato di pulizia ora appartiene
    // alla camera (Room.status = TO_CLEAN / AVAILABLE) e non alla prenotazione.
    // Tenere "cleaned" qui era semanticamente sbagliato: la pulizia è una
    // proprietà della stanza, non di chi ci ha soggiornato.
}
