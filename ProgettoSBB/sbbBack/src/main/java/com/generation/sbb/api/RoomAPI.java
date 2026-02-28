package com.generation.sbb.api;

import com.generation.sbb.dto.RoomDTO;
import com.generation.sbb.service.RoomService;
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
 * REST controller per la gestione delle camere.
 * Espone le operazioni CRUD su /sbb/api/rooms.
 * Nota: lo stato della camera (RoomStatus) non è modificabile da qui;
 * viene aggiornato automaticamente da BookingAPI tramite le transizioni di stato.
 */
@RestController
@RequestMapping("/sbb/api/rooms")
@CrossOrigin(origins = "http://localhost:4200")
public class RoomAPI
{
    @Autowired
    private RoomService service;

    /**
     * Crea una nuova camera.
     * @param dto dati della camera da inserire
     * @return 201 Created con il DTO salvato, 400 se la validazione fallisce
     */
    @PostMapping
    public ResponseEntity<Object> save(@RequestBody RoomDTO dto)
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
     * Aggiorna una camera esistente.
     * @param id identificativo della camera nel path
     * @param dto nuovi dati
     * @return 200 OK con il DTO aggiornato, 400 se la validazione fallisce
     */
    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable int id, @RequestBody RoomDTO dto)
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
     * @param id identificativo della camera da eliminare
     * @return 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id)
    {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * @param id identificativo della camera
     * @return DTO della camera, 404 se non trovata
     */
    @GetMapping("/{id}")
    public RoomDTO findById(@PathVariable int id)
    {
        return service.findById(id);
    }

    /** @return lista di tutte le camere di tutti gli hotel */
    @GetMapping
    public List<RoomDTO> findAll()
    {
        return service.findAll();
    }
}
