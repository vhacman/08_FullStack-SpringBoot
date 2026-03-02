package com.generation.veziocastelmanager.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TicketDTO
{
    private int         id;
    @NotNull(message = "Date is required")
    private LocalDate   date;
    private int         price;
    @NotNull(message = "Seller ID is required")
    private Integer     sellerId;
    @NotNull(message = "Visitor ID is required")
    private Integer     visitorId;
    // oggetti annidati per la lettura (response)
    private UserDTO     seller;
    private VisitorDTO  visitor;
}
