package com.generation.people.mapper;

import org.mapstruct.Mapper;

import com.generation.people.dto.PersonDTO;
import com.generation.people.model.Person;

@Mapper(componentModel = "spring", uses = { TraitMapper.class })
public interface PersonMapper {

    PersonDTO toDTO(Person person);
    Person toEntity(PersonDTO personDTO);

}
