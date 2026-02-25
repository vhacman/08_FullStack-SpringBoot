package com.generation.petshelterbe.dto;

import com.generation.petshelterbe.model.enums.PetSex;
import com.generation.petshelterbe.model.enums.PetStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;


// Il DTO (Data Transfer Object) è l'oggetto che viaggia tra backend e frontend.
// Separare il DTO dall'entità serve a non esporre direttamente la struttura del DB:
// possiamo decidere quali campi mandare al client senza toccare l'entità JPA.
// In questo caso il DTO ha la stessa struttura di Pet, ma in progetti più grandi
// potrebbero differire (es. nascondere campi sensibili o aggiungere campi calcolati).
@Getter
@Setter
public class PetDTO
{
    private int id;
    @NotBlank(message = "Name required")
    private String name;
    @NotBlank(message = "species required")
    private String species;
    @Min(value=0, message="age must be grater than 0")
    private int age;
    @NotBlank(message = "notes required")
    private String notes;

    // status e sex vengono aggiunti al DTO perché il frontend ha bisogno
    // di queste informazioni per filtrare e visualizzare correttamente i pet.
    private PetStatus status;
    private PetSex sex;

    // Stessa logica dell'entità: sterilizzato o meno
    private boolean sterilized;

    // Data di arrivo nel rifugio, esposta nel DTO per essere visibile al frontend
    private LocalDate arrivalDate;

}

