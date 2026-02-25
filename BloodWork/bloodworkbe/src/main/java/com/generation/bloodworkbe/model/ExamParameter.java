package com.generation.bloodworkbe.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Un parametro di un esame
 * senza lettura.
 */
@Entity
@Getter
@Setter
public class ExamParameter
{
    // memorizziamo il totale come quantità per prezzo unitario

    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	int id;
    
    @NotBlank(message="Name required")
    String name;
    
    @NotBlank(message="Notes required")
    String notes; 

    @NotBlank(message="Unit required")
    String unit; 

    @Min(value=0, message="Min cannot be negative")
    int min; // in centesimi
    
    @Min(value=0, message="Max cannot be negative")
    int max; // in centesimi


}
