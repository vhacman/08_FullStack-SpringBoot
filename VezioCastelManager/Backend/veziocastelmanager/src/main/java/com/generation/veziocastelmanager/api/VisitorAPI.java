package com.generation.veziocastelmanager.api;

import com.generation.veziocastelmanager.dto.VisitorDTO;
import com.generation.veziocastelmanager.service.VisitorService;
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

import java.util.List;

@RestController
@RequestMapping("/vcm/api/visitors")
@CrossOrigin(origins = "http://localhost:4200")
public class VisitorAPI
{
    @Autowired
    private VisitorService service;

    @GetMapping
    public List<VisitorDTO> findAll()
    {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public VisitorDTO findById(@PathVariable int id)
    {
        return service.findById(id);
    }

    @GetMapping("/search")
    public List<VisitorDTO> findByLastName(@RequestParam String lastName)
    {
        return service.findByLastName(lastName);
    }

    @PostMapping
    public ResponseEntity<Object> save(@RequestBody VisitorDTO dto)
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
    public ResponseEntity<Object> update(@PathVariable int id, @RequestBody VisitorDTO dto)
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
