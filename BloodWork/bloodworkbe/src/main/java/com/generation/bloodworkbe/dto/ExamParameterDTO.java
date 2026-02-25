package com.generation.bloodworkbe.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExamParameterDTO 
{
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
