package com.generation.sbb.mapper;

import com.generation.sbb.dto.BookingDTO;
import com.generation.sbb.model.Booking;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper MapStruct per la conversione Booking ↔ BookingDTO.
 * MapStruct genera automaticamente il codice di mapping a compile-time:
 * non serve scrivere manualmente i setter. Le annotazioni @Mapping
 * gestiscono i casi in cui i nomi dei campi differiscono tra entità e DTO
 * (es. guest.id → guestId e viceversa).
 * componentModel = "spring" fa sì che il mapper sia un bean Spring,
 * iniettabile normalmente con @Autowired.
 */
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