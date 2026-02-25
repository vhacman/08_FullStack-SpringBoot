package com.generation.sbb.mapper;

import com.generation.sbb.dto.GuestDTO;
import com.generation.sbb.model.Guest;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GuestMapper {

    GuestDTO toDTO(Guest guest);
    List<GuestDTO> toDTOs(List<Guest> guests);

    Guest toEntity(GuestDTO guestDTO);
    List<Guest> toEntities(List<GuestDTO> guestDTOs);
}