package com.generation.sbb.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HotelClosureDTO {

    private int id;

    @NotNull
    private int hotelId;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    private String reason;
}
