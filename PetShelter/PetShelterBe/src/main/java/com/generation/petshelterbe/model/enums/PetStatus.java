package com.generation.petshelterbe.model.enums;

// Enum che rappresenta il ciclo di vita di un animale nel rifugio.
// AVAILABLE  : l'animale è disponibile per l'adozione.
// IN_PROGRESS: è stata inviata una richiesta di adozione, in attesa di conferma dello staff.
// ADOPTED    : l'adozione è stata confermata, l'animale ha trovato casa.
// Aggiunto IN_PROGRESS rispetto alla consegna base per modellare il flusso intermedio
// tra la compilazione del modulo e la conferma dell'adozione.
public enum PetStatus {

    AVAILABLE,
    IN_PROGRESS,
    ADOPTED;
}
