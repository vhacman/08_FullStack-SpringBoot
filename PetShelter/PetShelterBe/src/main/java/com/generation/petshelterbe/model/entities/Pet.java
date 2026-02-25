package com.generation.petshelterbe.model.entities;

import com.generation.petshelterbe.model.enums.PetSex;
import com.generation.petshelterbe.model.enums.PetStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;


/*
 * @Data --> annotation lombok per prendere automaticamente
 * getter, setter,
 * nonnull, equals, requiredArgsConstructor, hashcode,
 */
@Entity
@Getter
@Setter
public class Pet
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Name required")
    private String name;
    @NotBlank(message = "species required")
    private String species;
    @Min(value=0, message="age must be grater than 0")
    private int age;
    @NotBlank(message = "notes required")
    private String notes;

    // @Enumerated(EnumType.STRING) dice a Hibernate di salvare il valore dell'enum
    // come stringa nel DB (es. "AVAILABLE") invece che come numero intero (0, 1, 2...).
    // Così il DB è leggibile anche senza guardare il codice Java.
    @Enumerated(EnumType.STRING)
    private PetStatus status;

    // Stessa strategia di status: salvato come stringa ("MALE"/"FEMALE") nel DB.
    @Enumerated(EnumType.STRING)
    private PetSex sex;

    // true se l'animale è stato sterilizzato, false altrimenti
    private boolean sterilized;

    // Data in cui l'animale è entrato nel rifugio.
    // Usata per calcolare quanto tempo è rimasto senza essere adottato.
    @Column(name = "arrival_date")
    private LocalDate arrivalDate;

}
