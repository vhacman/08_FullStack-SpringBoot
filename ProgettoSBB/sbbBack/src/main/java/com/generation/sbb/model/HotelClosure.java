package com.generation.sbb.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
