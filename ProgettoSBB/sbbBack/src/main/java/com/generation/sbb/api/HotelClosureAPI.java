package com.generation.sbb.api;

import com.generation.sbb.dto.HotelClosureDTO;
import com.generation.sbb.service.HotelClosureService;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sbb/api/closures")
@CrossOrigin(origins = "http://localhost:4200")
public class HotelClosureAPI {

    @Autowired
    private HotelClosureService service;

    @GetMapping("/hotel/{hotelId}")
    public List<HotelClosureDTO> findByHotel(@PathVariable int hotelId) {
        return service.findByHotelId(hotelId);
    }

    @PostMapping
    public ResponseEntity<HotelClosureDTO> save(@RequestBody HotelClosureDTO dto) {
        try {
            return ResponseEntity.status(201).body(service.save(dto));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Riapre un range di date: taglia le chiusure sovrapposte preservando le parti esterne.
    // Es. chiusura 1-31 gen, reopen 10-20 → rimangono 1-9 e 21-31.
    @DeleteMapping("/hotel/{hotelId}/range")
    public ResponseEntity<Void> reopenRange(
            @PathVariable int hotelId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        service.reopenRange(hotelId, from, to);
        return ResponseEntity.noContent().build();
    }
}
