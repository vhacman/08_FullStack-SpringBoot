package com.generation.sbb.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(name = "booking_from")
    private LocalDate from;

    @Column(name = "booking_to")
    private LocalDate to;

    @Min(value=0, message="Price cannot be negative")
    private int price;

    private String notes;

    //aggiungo status
    private String status = "SCHEDULED";
}