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

/**
 * Servizio CRUD per la gestione degli ospiti.
 * La logica è volutamente semplice: gli ospiti non hanno stati o transizioni,
 * quindi non serve nulla di più di un salva/leggi/elimina.
 * La validazione dei campi obbligatori è delegata a Jakarta Validation tramite @Valid.
 */
@Service
@Validated
public class GuestService
{
    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private GuestMapper guestMapper;

    /** @return lista di tutti gli ospiti registrati */
    public List<GuestDTO> findAll()
    {
        return guestMapper.toDTOs(guestRepository.findAll());
    }

    /**
     * @param id identificativo dell'ospite
     * @return DTO dell'ospite trovato
     * @throws EntityNotFoundException se nessun ospite ha quell'id
     */
    public GuestDTO findById(Integer id)
    {
        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Guest not found with id: " + id));
        return guestMapper.toDTO(guest);
    }

    /**
     * Crea o aggiorna un ospite. Se il DTO ha id > 0 aggiorna, altrimenti inserisce.
     * @param guestDTO dati dell'ospite da salvare (validati da @Valid)
     * @return DTO dell'ospite salvato, con id assegnato dal DB
     */
    public GuestDTO save(@Valid GuestDTO guestDTO)
    {
        Guest guest = guestMapper.toEntity(guestDTO);
        guest = guestRepository.save(guest);
        return guestMapper.toDTO(guest);
    }

    /**
     * @param id identificativo dell'ospite da eliminare
     */
    public void deleteById(Integer id)
    {
        guestRepository.deleteById(id);
    }
}
