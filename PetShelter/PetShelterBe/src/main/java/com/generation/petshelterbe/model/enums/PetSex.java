package com.generation.petshelterbe.model.enums;

// Enum aggiunto per rappresentare il sesso biologico dell'animale.
// Usare un enum invece di una stringa libera garantisce che nel DB
// possano finire solo valori validi (MALE o FEMALE).
public enum PetSex {
    MALE,
    FEMALE
}
