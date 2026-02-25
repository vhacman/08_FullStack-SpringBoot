package com.generation.sbb.api;

import com.generation.sbb.dto.HotelDTO;
import com.generation.sbb.dto.RoomDTO;
import com.generation.sbb.service.HotelService;
import jakarta.validation.ConstraintViolationException;
import java.time.LocalDate;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sbb/api/hotels")
@CrossOrigin(origins = "http://localhost:4200")
public class HotelAPI {

    @Autowired
    private HotelService service;

    @PostMapping
    public ResponseEntity<Object> save(@RequestBody HotelDTO dto) {
        try {
            dto = service.save(dto);
            return ResponseEntity.status(201).body(dto);
        } catch (ConstraintViolationException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable int id, @RequestBody HotelDTO dto) {
        try {
            dto.setId((long) id);
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
    public HotelDTO findById(@PathVariable int id) {
        return service.findById(id);
    }

    @GetMapping
    public List<HotelDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}/free-rooms")
    public List<RoomDTO> getFreeRooms(@PathVariable int id, @RequestParam LocalDate from, @RequestParam LocalDate to) {
        return service.findFreeRooms(id, from, to);
    }
}