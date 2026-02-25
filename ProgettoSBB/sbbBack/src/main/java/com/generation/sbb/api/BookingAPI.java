package com.generation.sbb.api;

import com.generation.sbb.dto.BookingDTO;
import com.generation.sbb.service.BookingService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sbb/api/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingAPI {

    @Autowired
    private BookingService service;

    @PostMapping
    public ResponseEntity<Object> save(@RequestBody BookingDTO dto) {
        try {
            dto = service.save(dto);
            return ResponseEntity.status(201).body(dto);
        } catch (ConstraintViolationException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable int id, @RequestBody BookingDTO dto) {
        try {
            dto.setId(id);
            dto = service.save(dto);
            return ResponseEntity.ok(dto);
        } catch (ConstraintViolationException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public BookingDTO findById(@PathVariable int id) {
        return service.findById(id);
    }

    @GetMapping("/todaysarrivals/{hotelId}")
    public List<BookingDTO> findAll(@PathVariable("hotelId") int hotelId) {
        return service.findTodaysArrivalForHotel(hotelId);
    }

    // TODO 25-02-26
    // Aggiunto rispetto all'endpoint /todaysarrivals/{hotelId}:
    // nuovo endpoint /todaysdepartures/{hotelId} che chiama findTodaysDeparturesForHotel.
    // (findTodaysDepartures invece di findAll).
    @GetMapping("/todaysdepartures/{hotelId}")
    public List<BookingDTO> findTodaysDepartures(@PathVariable("hotelId") int hotelId) {
        return service.findTodaysDeparturesForHotel(hotelId);
    }

    /**
     * Aggiorna parzialmente lo stato di una risorsa identificata dal suo ID.
     *
     * @param id     identificatore univoco della risorsa da aggiornare
     * @param status nuovo stato da assegnare alla risorsa
     * @return ResponseEntity vuoto con status 204 se aggiornato, 404 se non trovato
     */
    @PatchMapping("/{id}/{status}")
    public ResponseEntity<Void> changeStatus(@PathVariable("id") int id, @PathVariable("status") String status)
    {   /*
         * PATCH vs PUT — Modifica Parziale di una Risorsa:
         * → PUT sostituisce l'intera risorsa con una nuova versione
         * → PATCH modifica solo un campo specifico, lasciando il resto intatto
         * In questo caso aggiorniamo SOLO lo stato, senza toccare
         * gli altri dati della risorsa → rispetta il principio REST
         * di operazioni granulari e mirate.
         * 204: l'operazione è andata a buon fine ma non c'è
         *      nessun corpo da restituire nella risposta.
         * 404: il Service ha lanciato EntityNotFoundException
         *      perché nessuna riga corrisponde all'id ricevuto. */
        try
        {
            service.changeStatus(id, status);
            return ResponseEntity.status(204).build();
        }
        catch (EntityNotFoundException e)
        {
            return ResponseEntity.status(404).build();
        }
    }
}