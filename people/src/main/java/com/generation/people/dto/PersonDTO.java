package com.generation.people.dto;

import java.util.List;

import lombok.Data;

// questo dto non carica i figli... o avremmo un bel ciclo
@Data
public class PersonDTO {

    private int id;
    private String firstName;
    private String lastName;
    private int birthYear;
    private String gender;

    private PersonDTO father;
    private PersonDTO mother;

    private List<TraitDTO> traits;


}
