package com.generation.sbb.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingDTO {

    private int id;

    @NotNull(message = "Guest ID is required")
    private Long guestId;

    @NotNull(message = "Room ID is required")
    private Long roomId;

    // le stanze e i guest vengono normalmente DTOizzati senza prenotazioni
    // niente cicli!
    private RoomDTO room;

    private GuestDTO guest;

    @NotNull(message = "Start date is required")
    private LocalDate from;

    @NotNull(message = "End date is required")
    private LocalDate to;

    private String notes;

    @Min(value=0, message="Price cannot be negative")
    private int price;

    private String status;

    // Ho aggiunto cleaned anche nel DTO perché il frontend ne ha bisogno per
    // decidere quale pulsante mostrare (pulizie da fare / già fatte).
    // Senza questo campo il JSON di risposta non lo includerebbe e il frontend
    // non saprebbe mai se la camera è stata pulita o no.
    // MapStruct lo mappa automaticamente dall'entità al DTO perché il nome del campo
    // è identico in entrambe le classi → nessuna annotazione @Mapping necessaria.
    private boolean cleaned;
}
