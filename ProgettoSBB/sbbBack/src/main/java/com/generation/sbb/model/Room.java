package com.generation.sbb.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String description;
    private Double basePrice;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    // Stato corrente della camera. Viene aggiornato automaticamente dal
    // BookingService ad ogni transizione di stato della prenotazione:
    //   CHECKED_IN  → room diventa OCCUPIED
    //   CHECKED_OUT → room diventa TO_CLEAN
    //   COMPLETE    → room diventa AVAILABLE
    // Default AVAILABLE: una camera appena creata è libera e pronta.
    @Enumerated(EnumType.STRING)
    private RoomStatus status = RoomStatus.AVAILABLE;

    // Data dell'ultima pulizia certificata (quella fatta da BookingService.complete()).
    // Nullable: una camera nuova non ha ancora una data di pulizia.
    // Utile per segnalare camere AVAILABLE da troppo tempo senza essere state pulite,
    // ad esempio prima di accettare un nuovo ospite dopo un lungo periodo di inattività.
    private LocalDate lastCleaned;
}
