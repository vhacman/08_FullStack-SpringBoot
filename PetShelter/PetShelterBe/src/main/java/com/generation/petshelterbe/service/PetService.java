package com.generation.petshelterbe.service;

import com.generation.petshelterbe.dto.PetDTO;
import com.generation.petshelterbe.mapper.PetDTOMapper;
import com.generation.petshelterbe.model.entities.Pet;
import com.generation.petshelterbe.model.enums.PetSex;
import com.generation.petshelterbe.model.enums.PetStatus;
import com.generation.petshelterbe.model.repository.PetRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
// @Validated abilita la validazione delle annotazioni (@Valid, @NotBlank ecc.)
// sui parametri dei metodi di questa classe. Senza di essa @Valid nei metodi
// del Service verrebbe ignorato.
@Validated
public class PetService
{
    @Autowired
    private PetRepository   repo;

    // Il mapper viene iniettato da Spring: MapStruct ha generato un'implementazione
    // concreta di questa interfaccia durante la compilazione.
    @Autowired
    private PetDTOMapper    mapper;

    //  WRITE — Operazioni di scrittura (INSERT / UPDATE / DELETE)

    /**
     * Persiste un nuovo Pet nel database a partire da un DTO validato.
     *
     * @param petDTO il DTO contenente i dati del Pet da inserire
     * @return il DTO del Pet appena salvato, con ID generato
     */
    public PetDTO   insert(@Valid PetDTO petDTO)
    {
        Pet pet = repo.save(mapper.toEntity(petDTO));
        return mapper.toDTO(pet);
    }

    /**
     * Aggiorna tutti i campi di un Pet esistente identificato dall'ID.
     *
     * @param id     l'identificativo del Pet da aggiornare
     * @param petDTO il DTO con i nuovi valori da applicare
     * @return il DTO del Pet aggiornato
     * @throws EntityNotFoundException se nessun Pet corrisponde all'ID fornito
     */
    public PetDTO   updateById(int id, @Valid PetDTO petDTO)
    {
        Pet pet = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Can't update Pet with id " + id + " not found"));

        pet.setName(petDTO.getName());
        pet.setSpecies(petDTO.getSpecies());
        pet.setAge(petDTO.getAge());
        pet.setNotes(petDTO.getNotes());
        pet.setStatus(petDTO.getStatus());
        pet.setSterilized(petDTO.isSterilized());
        pet.setArrivalDate(petDTO.getArrivalDate());

        pet = repo.save(pet);
        return mapper.toDTO(pet);
    }

    /**
     * Aggiorna esclusivamente lo stato di un Pet identificato dall'ID.
     *
     * @param id        l'identificativo del Pet da aggiornare
     * @param newStatus il nuovo stato da assegnare al Pet
     * @return il DTO del Pet con lo stato aggiornato
     * @throws EntityNotFoundException se nessun Pet corrisponde all'ID fornito
     */
    // Metodo aggiunto rispetto al CRUD base: aggiornare solo lo status evita
    // che il frontend debba mandare tutti i campi del pet solo per cambiarne uno.
    // Questo approccio è mappato su una PATCH (aggiornamento parziale) invece di PUT.
    public PetDTO   updateStatusById(int id, PetStatus newStatus)
    {
        Pet pet = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Can't update status of Pet with id " + id + " not found"));

        pet.setStatus(newStatus);

        pet = repo.save(pet);
        return mapper.toDTO(pet);
    }

    /**
     * Elimina dal database il Pet corrispondente all'ID fornito.
     *
     * @param id l'identificativo del Pet da eliminare
     * @throws EntityNotFoundException se nessun Pet corrisponde all'ID fornito
     */
    public void     deleteById(int id)
    {
        Pet pet = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Can't delete Pet with id " + id + " not found"));

        repo.deleteById(id);
    }

    //  READ — Operazioni di lettura (FIND)
    /**
     * Recupera tutti i Pet presenti nel database.
     *
     * @return lista di DTO rappresentanti tutti i Pet salvati
     */
    public List<PetDTO>     findAll()
    {
        List<Pet> pets = repo.findAll();
        return mapper.toDTOList(pets);
    }

    /**
     * Recupera il Pet corrispondente all'ID fornito.
     *
     * @param id l'identificativo del Pet da cercare
     * @return il DTO del Pet trovato
     * @throws EntityNotFoundException se nessun Pet corrisponde all'ID fornito
     */
    public PetDTO   findById(int id)
    {
        Pet pet = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Pet with id " + id + " not found"));

        return mapper.toDTO(pet);
    }

    /**
     * Recupera tutti i Pet che corrispondono allo stato specificato.
     *
     * @param status lo stato da utilizzare come filtro di ricerca
     * @return lista di DTO dei Pet con lo stato corrispondente
     */
    public List<PetDTO> findByStatus(PetStatus status)
    {
        List<Pet> pets = repo.findByStatus(status);
        return mapper.toDTOList(pets);
    }

    /**
     * Recupera tutti i Pet appartenenti alla specie specificata.
     *
     * @param species la specie da utilizzare come filtro di ricerca
     * @return lista di DTO dei Pet della specie corrispondente
     */
    public List<PetDTO> findBySpecies(String species)
    {
        List<Pet> pets = repo.findBySpecies(species);
        return mapper.toDTOList(pets);
    }

    /**
     * Recupera tutti i Pet con il sesso biologico specificato.
     *
     * @param sex il sesso da utilizzare come filtro di ricerca
     * @return lista di DTO dei Pet con il sesso corrispondente
     */
    public List<PetDTO> findBySex(PetSex sex)
    {
        List<Pet> pets = repo.findBySex(sex);
        return mapper.toDTOList(pets);
    }

    /**
     * Restituisce la lista degli animali candidati alla soppressione.
     * Metodo aggiunto come logica di business: usa le Stream API di Java
     * per filtrare la lista in memoria invece di scrivere una query SQL custom.
     *
     * Le regole sono:
     * - Regola 1: qualsiasi animale rimasto nel rifugio per più di 3 anni.
     * - Regola 2: animali con età superiore a 10 anni che sono nel rifugio
     *             da almeno 1 anno (animali anziani con basse probabilità di adozione).
     *
     * I pet senza arrivalDate vengono esclusi (campo non disponibile).
     *
     * @return lista di DTO dei Pet che soddisfano almeno una delle due regole
     */
    public List<PetDTO> getSuppressionList()
    {
        LocalDate now           = LocalDate.now();
        LocalDate threeYearsAgo = now.minusYears(3);
        LocalDate oneYearAgo    = now.minusYears(1);

        List<Pet> candidates = repo.findAll().stream()
                // Un animale già adottato non ha senso nella lista soppressione
                .filter(pet -> pet.getStatus() != PetStatus.ADOPTED)
                .filter(pet -> pet.getArrivalDate() != null)
                .filter(pet ->
                        // Regola 1: nel rifugio da più di 3 anni
                        pet.getArrivalDate().isBefore(threeYearsAgo)
                        ||
                        // Regola 2: anziano (>10 anni) + nel rifugio da almeno 1 anno
                        (pet.getAge() > 10 && pet.getArrivalDate().isBefore(oneYearAgo))
                )
                .collect(Collectors.toList());

        return mapper.toDTOList(candidates);
    }
}