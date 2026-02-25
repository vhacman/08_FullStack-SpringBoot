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
}