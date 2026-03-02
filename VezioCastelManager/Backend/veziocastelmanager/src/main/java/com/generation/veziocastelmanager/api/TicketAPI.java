package com.generation.veziocastelmanager.api;

import com.generation.veziocastelmanager.dto.TicketDTO;
import com.generation.veziocastelmanager.service.TicketService;
import jakarta.validation.ConstraintViolationException;
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

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/vcm/api/tickets")
@CrossOrigin(origins = "http://localhost:4200")
public class TicketAPI
{
    @Autowired
    private TicketService service;

    @GetMapping
    public List<TicketDTO> findAll()
    {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public TicketDTO findById(@PathVariable int id)
    {
        return service.findById(id);
    }

    @GetMapping("/seller/{sellerId}")
    public List<TicketDTO> findBySellerId(@PathVariable int sellerId)
    {
        return service.findBySellerId(sellerId);
    }

    @GetMapping("/visitor/{visitorId}")
    public List<TicketDTO> findByVisitorId(@PathVariable int visitorId)
    {
        return service.findByVisitorId(visitorId);
    }

    @GetMapping("/date")
    public List<TicketDTO> findByDate(@RequestParam LocalDate date)
    {
        return service.findByDate(date);
    }

    @PostMapping
    public ResponseEntity<Object> save(@RequestBody TicketDTO dto)
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
    public ResponseEntity<Object> update(@PathVariable int id, @RequestBody TicketDTO dto)
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
}
