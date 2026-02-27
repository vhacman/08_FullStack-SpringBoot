package com.generation.sbb.dto;

import com.generation.sbb.model.RoomStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomDTO {

    private int id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Base price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private Double basePrice;

    @NotNull(message = "Hotel ID is required")
    private Long hotelId;

    // Stato corrente della camera, esposto al frontend per guidare la UI:
    // il frontend mostra pulsanti e colori diversi a seconda di AVAILABLE / OCCUPIED / TO_CLEAN.
    // MapStruct lo mappa automaticamente dall'entità perché il nome coincide.
    private RoomStatus status;

    // Data dell'ultima pulizia. Nullable: le camere nuove non hanno ancora una data.
    // Il frontend può usarla per mostrare "ultima pulizia: X giorni fa" o
    // segnalare camere che non vengono pulite da troppo tempo.
    private LocalDate lastCleaned;
}
