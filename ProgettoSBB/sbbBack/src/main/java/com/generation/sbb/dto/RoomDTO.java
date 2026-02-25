package com.generation.sbb.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
}