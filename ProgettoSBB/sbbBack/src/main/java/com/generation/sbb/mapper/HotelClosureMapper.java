package com.generation.sbb.mapper;

import com.generation.sbb.dto.HotelClosureDTO;
import com.generation.sbb.model.HotelClosure;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper MapStruct per la conversione HotelClosure ↔ HotelClosureDTO.
 * La particolarità è il campo hotel:
 * nell'entità è un oggetto Hotel, nel DTO è solo un intero hotelId.
 * Le annotazioni @Mapping gestiscono questa differenza automaticamente.
 */
@Mapper(componentModel = "spring")
public interface HotelClosureMapper
{
    @Mapping(source = "hotel.id", target = "hotelId")
    HotelClosureDTO             toDTO(HotelClosure closure);
    List<HotelClosureDTO>       toDTOs(List<HotelClosure> closures);

    @Mapping(source = "hotelId", target = "hotel.id")
    HotelClosure                toEntity(HotelClosureDTO dto);
    List<HotelClosure>          toEntities(List<HotelClosureDTO> dtos);
}
