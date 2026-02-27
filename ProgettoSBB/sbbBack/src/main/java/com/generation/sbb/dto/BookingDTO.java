package com.generation.sbb.dto;

import com.generation.sbb.model.BookingStatus;
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
    private int guestId;

    @NotNull(message = "Room ID is required")
    private int roomId;

    // Le stanze e i guest vengono DTOizzati senza includere le prenotazioni:
    // evita riferimenti circolari (Booking → Room → Booking → ...) che
    // causerebbero un loop infinito durante la serializzazione JSON.
    private RoomDTO room;
    private GuestDTO guest;

    @NotNull(message = "Check-in date is required")
    private LocalDate checkIn;

    @NotNull(message = "Check-out date is required")
    private LocalDate checkOut;

    private String notes;

    @Min(value=0, message="Price cannot be negative")
    private int price;

    // Tipizzato come BookingStatus (enum) invece di String per due motivi:
    // 1. Il frontend riceve sempre uno dei valori definiti, mai stringhe arbitrarie.
    // 2. MapStruct mappa automaticamente l'enum tra entità e DTO senza annotazioni
    //    aggiuntive, perché il nome del campo e il tipo coincidono.
    // Non è @NotNull perché alla creazione può arrivare null: il BookingService
    // imposta PENDING come default se il campo non è valorizzato.
    private BookingStatus status;
}
