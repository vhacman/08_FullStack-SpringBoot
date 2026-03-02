package com.generation.veziocastelmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class VisitorDTO
{
    private int         id;
    @NotBlank(message = "First name is required")
    private String      firstName;
    @NotBlank(message = "Last name is required")
    private String      lastName;
    @NotNull(message = "Date of birth is required")
    private LocalDate   dateOfBirth;
}
