package com.generation.petshelterbe.mapper;

import com.generation.petshelterbe.dto.PetDTO;
import com.generation.petshelterbe.model.entities.Pet;
import org.mapstruct.Mapper;

import java.util.List;

// MapStruct è una libreria che genera automaticamente il codice di conversione
// tra entità e DTO (e viceversa) a partire da questa interfaccia.
// @Mapper(componentModel = "spring") fa sì che MapStruct crei un bean Spring
// iniettabile con @Autowired nel Service.
// Senza MapStruct dovremmo scrivere a mano tutti i pet.setName(dto.getName()) ecc.
@Mapper(componentModel = "spring")
public interface PetDTOMapper {

    // Converte un'entità Pet (dal DB) in un PetDTO (da mandare al frontend)
    PetDTO          toDTO(Pet petEntity);

    // Converte un PetDTO (ricevuto dal frontend) in un'entità Pet (da salvare nel DB)
    Pet             toEntity(PetDTO petDTO);

    // Converte una lista di entità in una lista di DTO, usata nelle chiamate GET
    List<PetDTO>    toDTOList(List<Pet> petList);

}
