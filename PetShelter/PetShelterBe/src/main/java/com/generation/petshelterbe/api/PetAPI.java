package com.generation.petshelterbe.api;

import com.generation.petshelterbe.dto.PetDTO;
import com.generation.petshelterbe.model.entities.Pet;
import com.generation.petshelterbe.model.enums.PetSex;
import com.generation.petshelterbe.model.enums.PetStatus;
import com.generation.petshelterbe.service.PetService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// @CrossOrigin abilita le richieste cross-origin dal frontend Angular (porta 4200).
// Senza questo header, il browser blocca le risposte perché frontend e backend
// girano su porte diverse (4200 vs 8080), violando la Same-Origin Policy.
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/petshelterbe/api/pets")
public class PetAPI
{
    @Autowired
    private PetService petService;

    /**
     * Restituisce tutti i pet presenti nel sistema.
     *
     * @return lista di PetDTO con status 200
     */
    @GetMapping
    public ResponseEntity<Object> findAll()
    {
        try
        {
            List<PetDTO> pets = petService.findAll();
            return ResponseEntity.ok(pets);
        }
        catch (Exception e)
        {
            Map<String, Object> response = new HashMap<>();
            response.put("errors", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Restituisce un pet tramite il suo identificativo univoco.
     *
     * @param id identificativo del pet
     * @return PetDTO con status 200, oppure errore 404 con messaggio
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable int id)
    {
        try
        {
            PetDTO petDTO = petService.findById(id);
            return ResponseEntity.ok(petDTO);
        }
        catch (EntityNotFoundException e)
        {
            Map<String, Object> response = new HashMap<>();
            response.put("errors", e.getMessage());
            return ResponseEntity.status(404).body(response);
        }
    }

    /**
     * Inserisce un nuovo pet nel sistema.
     *
     * @param petDTO dati del pet da inserire
     * @return PetDTO inserito con status 201
     */
    @PostMapping
    public ResponseEntity<Object> insert(@RequestBody PetDTO petDTO)
    {
        try
        {
            PetDTO inserted = petService.insert(petDTO);
            return ResponseEntity.status(201).body(inserted);
        }
        catch (Exception e)
        {
            Map<String, Object> response = new HashMap<>();
            response.put("errors", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    /**
     * Aggiorna tutti i campi di un pet tramite il suo identificativo.
     *
     * @param id     identificativo del pet da aggiornare
     * @param petDTO nuovi dati del pet
     * @return PetDTO aggiornato con status 200, oppure errore 404
     */
    @PutMapping("/{id}")
    public ResponseEntity<Object> updateById(@PathVariable int id, @RequestBody PetDTO petDTO)
    {
        try
        {
            PetDTO updated = petService.updateById(id, petDTO);
            return ResponseEntity.ok(updated);
        }
        catch (EntityNotFoundException e)
        {
            Map<String, Object> response = new HashMap<>();
            response.put("errors", e.getMessage());
            return ResponseEntity.status(404).body(response);
        }
    }

    /**
     * Aggiorna il solo status di un pet tramite il suo identificativo.
     *
     * @param id        identificativo del pet
     * @param newStatus nuovo status da applicare
     * @return PetDTO aggiornato con status 200, oppure errore 404
     */
    // Endpoint aggiunto rispetto al CRUD base: usa PATCH invece di PUT perché
    // modifica solo un campo (status) e non l'intera risorsa.
    // Il body della richiesta contiene direttamente il valore dell'enum come stringa JSON
    // (es. "IN_PROGRESS"), non un oggetto completo.
    @PatchMapping("/{id}/status")
    public ResponseEntity<Object> updateStatusById(@PathVariable int id, @RequestBody PetStatus newStatus)
    {
        try
        {
            PetDTO updated = petService.updateStatusById(id, newStatus);
            return ResponseEntity.ok(updated);
        }
        catch (EntityNotFoundException e)
        {
            Map<String, Object> response = new HashMap<>();
            response.put("errors", e.getMessage());
            return ResponseEntity.status(404).body(response);
        }
    }

    /**
     * Elimina un pet tramite il suo identificativo.
     *
     * @param id identificativo del pet da eliminare
     * @return status 204 senza body, oppure errore 404
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable int id)
    {
        try
        {
            petService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        catch (EntityNotFoundException e)
        {
            Map<String, Object> response = new HashMap<>();
            response.put("errors", e.getMessage());
            return ResponseEntity.status(404).body(response);
        }
    }

    /**
     * Restituisce tutti i pet filtrati per status.
     *
     * @param status lo status per cui filtrare
     * @return lista di PetDTO con status 200
     */
    // Endpoint di filtro aggiunto rispetto al CRUD base.
    // Il valore del path (es. /status/AVAILABLE) viene convertito automaticamente
    // da Spring nell'enum PetStatus grazie a @PathVariable.
    @GetMapping("/status/{status}")
    public ResponseEntity<Object> findByStatus(@PathVariable PetStatus status)
    {
        try
        {
            List<PetDTO> pets = petService.findByStatus(status);
            return ResponseEntity.ok(pets);
        }
        catch (Exception e)
        {
            Map<String, Object> response = new HashMap<>();
            response.put("errors", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Restituisce tutti i pet filtrati per specie.
     *
     * @param species la specie per cui filtrare
     * @return lista di PetDTO con status 200
     */
    @GetMapping("/species/{species}")
    public ResponseEntity<Object> findBySpecies(@PathVariable String species)
    {
        try
        {
            List<PetDTO> pets = petService.findBySpecies(species);
            return ResponseEntity.ok(pets);
        }
        catch (Exception e)
        {
            Map<String, Object> response = new HashMap<>();
            response.put("errors", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Restituisce tutti i pet filtrati per sesso biologico.
     *
     * @param sex il sesso per cui filtrare
     * @return lista di PetDTO con status 200
     */
    @GetMapping("/sex/{sex}")
    public ResponseEntity<Object> findBySex(@PathVariable PetSex sex)
    {
        try
        {
            List<PetDTO> pets = petService.findBySex(sex);
            return ResponseEntity.ok(pets);
        }
        catch (Exception e)
        {
            Map<String, Object> response = new HashMap<>();
            response.put("errors", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Restituisce la lista degli animali candidati alla soppressione.
     *
     * Criteri (vedi PetService.getSuppressionList per i dettagli):
     * - nel rifugio da più di 3 anni, OPPURE
     * - età > 10 anni e nel rifugio da almeno 1 anno
     *
     * @return lista di PetDTO con status 200
     */
    // Endpoint aggiunto per implementare una regola di business specifica del rifugio.
    // La logica di filtraggio è nel Service (non nel Repository) perché usa
    // le Stream API di Java piuttosto che una query SQL custom.
    @GetMapping("/suppression-list")
    public ResponseEntity<Object> getSuppressionList()
    {
        try
        {
            List<PetDTO> pets = petService.getSuppressionList();
            return ResponseEntity.ok(pets);
        }
        catch (Exception e)
        {
            Map<String, Object> response = new HashMap<>();
            response.put("errors", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}