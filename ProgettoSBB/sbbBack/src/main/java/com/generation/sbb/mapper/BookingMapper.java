package com.generation.sbb.mapper;

import com.generation.sbb.dto.BookingDTO;
import com.generation.sbb.model.Booking;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    @Mapping(source = "guest.id", target = "guestId")
    @Mapping(source = "room.id", target = "roomId")
    BookingDTO toDTO(Booking booking);
    List<BookingDTO> toDTOs(List<Booking> bookings);

    @Mapping(source = "guestId", target = "guest.id")
    @Mapping(source = "roomId", target = "room.id")
    Booking toEntity(BookingDTO bookingDTO);
    List<Booking> toEntities(List<BookingDTO> bookingDTOs);
}