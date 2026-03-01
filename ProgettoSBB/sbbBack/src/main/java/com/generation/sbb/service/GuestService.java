package com.generation.sbb.service;

import com.generation.sbb.dto.GuestDTO;
import com.generation.sbb.mapper.GuestMapper;
import com.generation.sbb.model.Guest;
import com.generation.sbb.repository.BookingRepository;
import com.generation.sbb.repository.GuestRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    private BookingRepository bookingRepository;

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
     * Gab 01/03/26
     * Soft delete di un ospite e di tutte le sue prenotazioni collegate.
     *
     * Flusso completo:
     *   Il frontend mostra il popup di conferma; l'utente clicca "Elimina".
     *   Angular chiama DELETE /guests/{id} → GuestController → questo metodo.
     *   Qui facciamo due UPDATE (non DELETE):
     *       - booking SET deleted = true WHERE guest_id = ?
     *       - guest  SET deleted = true WHERE id = ?
     *     Le righe restano fisicamente nel DB come traccia storica.
     *   @SQLRestriction("deleted = false") su Guest e Booking istruisce Hibernate
     *     ad aggiungere automaticamente "WHERE deleted = false" a ogni query su quelle
     *     entità: nessun repository esistente deve essere modificato per ignorarle.
     *  La successiva findAll() restituisce la lista senza l'ospite appena marcato,
     *     il frontend aggiorna la card list e l'ospite sparisce dall'interfaccia.
     *
     * @param id identificativo dell'ospite da eliminare logicamente
     */
    // @Transactional garantisce che i due UPDATE avvengano nella stessa transazione:
    // se uno fallisce, l'altro viene annullato automaticamente (rollback).
    @Transactional
    public void deleteById(Integer id)
    {
        // Prima marco come eliminati i Booking dell'ospite, poi l'ospite stesso.
        // L'ordine non è strettamente necessario per il soft delete (nessuna FK viene
        // violata), ma manteniamo la stessa sequenza logica: prima i figli, poi il padre.
        bookingRepository.softDeleteByGuestId(id);
        guestRepository.softDeleteById(id);
    }
}
