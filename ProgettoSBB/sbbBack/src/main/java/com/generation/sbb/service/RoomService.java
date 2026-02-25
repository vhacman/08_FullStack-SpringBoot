package com.generation.sbb.service;

import com.generation.sbb.dto.RoomDTO;
import com.generation.sbb.mapper.RoomMapper;
import com.generation.sbb.model.Room;
import com.generation.sbb.repository.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomMapper roomMapper;

    public List<RoomDTO> findAll() {
        return roomMapper.toDTOs(roomRepository.findAll());
    }

    public RoomDTO findById(Integer id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Room not found with id: " + id));
        return roomMapper.toDTO(room);
    }

    public RoomDTO save(@Valid RoomDTO roomDTO) {
        Room room = roomMapper.toEntity(roomDTO);
        room = roomRepository.save(room);
        return roomMapper.toDTO(room);
    }

    public void deleteById(Integer id) {
        roomRepository.deleteById(id);
    }
}