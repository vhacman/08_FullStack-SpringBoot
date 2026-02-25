package com.generation.sbb.service;

import com.generation.sbb.dto.GuestDTO;
import com.generation.sbb.mapper.GuestMapper;
import com.generation.sbb.model.Guest;
import com.generation.sbb.repository.GuestRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
public class GuestService {

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private GuestMapper guestMapper;

    public List<GuestDTO> findAll() {
        return guestMapper.toDTOs(guestRepository.findAll());
    }

    public GuestDTO findById(Integer id) {
        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Guest not found with id: " + id));
        return guestMapper.toDTO(guest);
    }

    public GuestDTO save(@Valid GuestDTO guestDTO) {
        Guest guest = guestMapper.toEntity(guestDTO);
        guest = guestRepository.save(guest);
        return guestMapper.toDTO(guest);
    }

    public void deleteById(Integer id) {
        guestRepository.deleteById(id);
    }
}