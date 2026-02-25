package com.generation.sbb.mapper;

import com.generation.sbb.dto.HotelDTO;
import com.generation.sbb.model.Hotel;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HotelMapper {

    HotelDTO toDTO(Hotel hotel);
    List<HotelDTO> toDTOs(List<Hotel> hotels);

    Hotel toEntity(HotelDTO hotelDTO);
    List<Hotel> toEntities(List<HotelDTO> hotelDTOs);
}