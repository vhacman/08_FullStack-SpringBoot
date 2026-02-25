package com.generation.sbb.mapper;

import com.generation.sbb.dto.RoomDTO;
import com.generation.sbb.model.Room;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoomMapper {

    @Mapping(source = "hotel.id", target = "hotelId")
    RoomDTO toDTO(Room room);
    List<RoomDTO> toDTOs(List<Room> rooms);

    @Mapping(source = "hotelId", target = "hotel.id")
    Room toEntity(RoomDTO roomDTO);
    List<Room> toEntities(List<RoomDTO> roomDTOs);
}