package com.generation.sbb.api;

import com.generation.sbb.dto.BookingDTO;
import com.generation.sbb.service.BookingService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller per la gestione delle prenotazioni.
 * Oltre al CRUD base, espone endpoint PATCH dedicati per ogni transizione
 * di stato della macchina a stati (checkin, cancel, checkout, complete).
 * Questo approccio è preferibile a un singolo PATCH /{id}/status perché
 * il client non può impostare stati arbitrari, solo le azioni previste.
 */
@RestController
@RequestMapping("/sbb/api/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingAPI
{
    @Autowired
    private BookingService service;

    @PostMapping
    public ResponseEntity<Object> save(@RequestBody BookingDTO dto)
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

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable int id, @RequestBody BookingDTO dto)
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id)
    {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public BookingDTO findById(@PathVariable int id)
    {
        return service.findById(id);
    }

    @GetMapping("/todaysarrivals/{hotelId}")
    public List<BookingDTO> findTodaysArrivals(@PathVariable int hotelId)
    {
        return service.findTodaysArrivalForHotel(hotelId);
    }

    @GetMapping("/hotel/{hotelId}")
    public List<BookingDTO> findByHotel(@PathVariable int hotelId)
    {
        return service.findByHotelId(hotelId);
    }

    @GetMapping("/todaysdepartures/{hotelId}")
    public List<BookingDTO> findTodaysDepartures(@PathVariable int hotelId)
    {
        return service.findTodaysDeparturesForHotel(hotelId);
    }

    // ── Transizioni di stato ─────────────────────────────────────────────────
    // Usiamo endpoint dedicati invece di un unico PATCH /{id}/{status} per due motivi:
    // 1. Sicurezza: il client non può inviare un valore di status arbitrario,
    //    solo le azioni esplicitamente previste dall'API.
    // 2. Chiarezza: ogni endpoint ha un nome che rispecchia l'azione di dominio,
    //    non un dettaglio implementativo (il nome dello stato).
    // Tutti restituiscono 204 No Content: l'operazione è riuscita ma non c'è
    // corpo da restituire (il frontend aggiorna il signal localmente).
    // 400 Bad Request se la transizione non è consentita (es. checkout su PENDING).
    // 404 Not Found se la prenotazione non esiste.

    // PENDING → CHECKED_IN  |  room → OCCUPIED
    @PatchMapping("/{id}/checkin")
    public ResponseEntity<Void> checkIn(@PathVariable int id)
    {
        try
        {
            service.acceptBooking(id);
            return ResponseEntity.noContent().build();
        }
        catch (EntityNotFoundException e)
        {
            return ResponseEntity.notFound().build();
        }
        catch (IllegalStateException e)
        {
            return ResponseEntity.badRequest().build();
        }
    }

    // PENDING → CANCELED
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable int id)
    {
        try
        {
            service.cancel(id);
            return ResponseEntity.noContent().build();
        }
        catch (EntityNotFoundException e)
        {
            return ResponseEntity.notFound().build();
        }
        catch (IllegalStateException e)
        {
            return ResponseEntity.badRequest().build();
        }
    }

    // CHECKED_IN → CHECKED_OUT  |  room → TO_CLEAN
    // Il service valida che la data odierna >= checkOut prima di procedere.
    @PatchMapping("/{id}/checkout")
    public ResponseEntity<Void> checkout(@PathVariable int id)
    {
        try
        {
            service.checkout(id);
            return ResponseEntity.noContent().build();
        }
        catch (EntityNotFoundException e)
        {
            return ResponseEntity.notFound().build();
        }
        catch (IllegalStateException e)
        {
            return ResponseEntity.badRequest().build();
        }
    }

    // CHECKED_OUT → COMPLETE  |  room → AVAILABLE + lastCleaned = oggi
    // Chiamato dal frontend quando il personale segna la camera come pulita.
    @PatchMapping("/{id}/complete")
    public ResponseEntity<Void> complete(@PathVariable int id)
    {
        try
        {
            service.complete(id);
            return ResponseEntity.noContent().build();
        }
        catch (EntityNotFoundException e)
        {
            return ResponseEntity.notFound().build();
        }
        catch (IllegalStateException e)
        {
            return ResponseEntity.badRequest().build();
        }
    }
}
