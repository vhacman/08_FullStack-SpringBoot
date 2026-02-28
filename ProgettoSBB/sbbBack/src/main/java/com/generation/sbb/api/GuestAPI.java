package com.generation.sbb.api;

import com.generation.sbb.dto.GuestDTO;
import com.generation.sbb.service.GuestService;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller per la gestione degli ospiti.
 * Espone le operazioni CRUD standard su /sbb/api/guests.
 * @CrossOrigin permette le chiamate dal frontend Angular in sviluppo (porta 4200).
 */
@RestController
@RequestMapping("/sbb/api/guests")
@CrossOrigin(origins = "http://localhost:4200")
public class GuestAPI
{
    @Autowired
    private GuestService service;

    /**
     * Crea un nuovo ospite.
     * @param dto dati dell'ospite da inserire
     * @return 201 Created con il DTO salvato, 400 se la validazione fallisce
     */
    @PostMapping
    public ResponseEntity<Object> save(@RequestBody GuestDTO dto)
    {
        try
        {
            dto = service.save(dto);
            return ResponseEntity.status(201).body(dto);
        }
        catch (ConstraintViolationException e)
        {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    /**
     * Aggiorna un ospite esistente.
     * @param id identificativo dell'ospite nel path
     * @param dto nuovi dati (l'id nel path ha precedenza su quello nel body)
     * @return 200 OK con il DTO aggiornato, 400 se la validazione fallisce
     */
    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable int id, @RequestBody GuestDTO dto)
    {
        try
        {
            dto.setId(id);
            dto = service.save(dto);
            return ResponseEntity.ok(dto);
        }
        catch (ConstraintViolationException e)
        {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    /**
     * @param id identificativo dell'ospite da eliminare
     * @return 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id)
    {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * @param id identificativo dell'ospite
     * @return DTO dell'ospite, 404 se non trovato
     */
    @GetMapping("/{id}")
    public GuestDTO findById(@PathVariable int id)
    {
        return service.findById(id);
    }

    /** @return lista di tutti gli ospiti registrati */
    @GetMapping
    public List<GuestDTO> findAll()
    {
        return service.findAll();
    }
}
