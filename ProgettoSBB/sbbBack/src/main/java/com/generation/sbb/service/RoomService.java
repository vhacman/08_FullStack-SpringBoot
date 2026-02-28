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

/**
 * Servizio CRUD per la gestione delle camere.
 * Lo stato della camera (RoomStatus) non viene modificato qui:
 * è responsabilità esclusiva di BookingService aggiornarlo a ogni
 * transizione di prenotazione, per mantenere la coerenza tra i due.
 */
@Service
@Validated
public class RoomService
{
    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomMapper roomMapper;

    /** @return lista di tutte le camere di tutti gli hotel */
    public List<RoomDTO> findAll()
    {
        return roomMapper.toDTOs(roomRepository.findAll());
    }

    /**
     * @param id identificativo della camera
     * @return DTO della camera trovata
     * @throws EntityNotFoundException se nessuna camera ha quell'id
     */
    public RoomDTO findById(Integer id)
    {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Room not found with id: " + id));
        return roomMapper.toDTO(room);
    }

    /**
     * Crea o aggiorna una camera. Se il DTO ha id > 0 aggiorna, altrimenti inserisce.
     * @param roomDTO dati della camera (validati da @Valid)
     * @return DTO della camera salvata con id assegnato dal DB
     */
    public RoomDTO save(@Valid RoomDTO roomDTO)
    {
        Room room = roomMapper.toEntity(roomDTO);
        room = roomRepository.save(room);
        return roomMapper.toDTO(room);
    }

    /**
     * @param id identificativo della camera da eliminare
     */
    public void deleteById(Integer id)
    {
        roomRepository.deleteById(id);
    }
}
