package com.generation.veziocastelmanager.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO
{
    private int         id;
    @NotBlank(message = "First name is required")
    private String      firstName;
    @NotBlank(message = "Last name is required")
    private String      lastName;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String      email;
    @NotBlank(message = "Password is required")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String      password;
    @NotBlank(message = "Username is required")
    private String      username;
}
