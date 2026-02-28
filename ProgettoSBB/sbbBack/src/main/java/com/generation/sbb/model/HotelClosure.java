package com.generation.sbb.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Periodo di chiusura dichiarato per un hotel (ferie, ristrutturazione, ecc.).
 * Il calendario nel frontend usa questi record per colorare le date chiuse
 * e bloccare la creazione di prenotazioni su di esse.
 * Più closure possono coesistere, ma non devono sovrapporsi: la logica
 * di split/merge è gestita da HotelClosureService.reopenRange().
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelClosure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    private LocalDate startDate;
    private LocalDate endDate;

    // Motivazione facoltativa (es. "Ristrutturazione", "Ferie")
    private String reason;
}
