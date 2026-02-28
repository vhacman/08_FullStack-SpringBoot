package com.generation.sbb.model;

import jakarta.persistence.*;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Hotel gestito dal sistema. A ogni hotel appartengono camere (Room) e utenti (User).
 * Il sistema è multi-hotel: ogni receptionist è associato al proprio hotel
 * e vede solo i dati di competenza.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String address;
    private String city;

    @OneToMany(mappedBy = "hotel")
    private List<Room> rooms;
}