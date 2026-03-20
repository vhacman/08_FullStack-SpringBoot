package com.generation.people.mapper;

import org.mapstruct.Mapper;

import com.generation.people.dto.TraitDTO;
import com.generation.people.model.Trait;

@Mapper(componentModel = "spring")
public interface TraitMapper {

    TraitDTO toDTO(Trait trait);
    Trait toEntity(TraitDTO traitDTO);


}
