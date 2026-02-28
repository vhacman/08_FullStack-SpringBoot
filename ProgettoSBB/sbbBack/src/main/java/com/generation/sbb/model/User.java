package com.generation.sbb.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Utente autenticato del sistema (receptionist o admin).
 * Ogni utente è collegato a un hotel: il frontend sfrutta questa relazione
 * per filtrare automaticamente camere e prenotazioni di competenza.
 * La password viene salvata come hash MD5 tramite PasswordHasher.
 * @see UserRole
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel = new Hotel();

}
