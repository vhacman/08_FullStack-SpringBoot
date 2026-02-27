package com.generation.sbb.service;

import com.generation.sbb.dto.HotelDTO;
import com.generation.sbb.dto.RoomDTO;
import com.generation.sbb.mapper.HotelMapper;
import com.generation.sbb.mapper.RoomMapper;
import com.generation.sbb.model.Hotel;
import com.generation.sbb.repository.HotelRepository;
import com.generation.sbb.repository.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private HotelMapper hotelMapper;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomMapper roomMapper;

    public List<HotelDTO> findAll() {
        return hotelMapper.toDTOs(hotelRepository.findAll());
    }

    public HotelDTO findById(Integer id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Hotel not found with id: " + id));
        return hotelMapper.toDTO(hotel);
    }

    public HotelDTO save(@Valid HotelDTO hotelDTO) {
        Hotel hotel = hotelMapper.toEntity(hotelDTO);
        hotel = hotelRepository.save(hotel);
        return hotelMapper.toDTO(hotel);
    }

    public void deleteById(Integer id) {
        hotelRepository.deleteById(id);
    }

    public List<RoomDTO> findFreeRooms(int hotelId, LocalDate checkIn, LocalDate checkOut) {
        return roomMapper.toDTOs(roomRepository.findFreeRoomsInHotel(hotelId, checkIn, checkOut));
    }
}