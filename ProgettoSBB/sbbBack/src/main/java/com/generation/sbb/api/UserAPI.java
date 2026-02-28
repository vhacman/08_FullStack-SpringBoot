package com.generation.sbb.api;

import com.generation.sbb.dto.LoginDTO;
import com.generation.sbb.dto.TokenDTO;
import com.generation.sbb.dto.UserDTO;
import com.generation.sbb.service.UserService;
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
 * REST controller per la gestione degli utenti e dell'autenticazione.
 * L'endpoint /default è una scorciatoia didattica che restituisce sempre
 * l'utente con id=1, simulando una sessione già autenticata senza dover
 * implementare un sistema di login completo nel frontend.
 */
@RestController
@RequestMapping("/sbb/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserAPI
{
    @Autowired
    private UserService service;

    @GetMapping("/default")
    public UserDTO getDefault()
    {
        return service.findById(1);
    }

    @PostMapping
    public ResponseEntity<Object> save(@RequestBody UserDTO dto)
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
    public ResponseEntity<Object> update(@PathVariable int id, @RequestBody UserDTO dto)
    {
        try
        {
            dto.setId((long) id);
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
    public UserDTO findById(@PathVariable int id)
    {
        return service.findById(id);
    }

    @GetMapping
    public List<UserDTO> findAll()
    {
        return service.findAll();
    }

    @PostMapping("/login")
    public TokenDTO login(@RequestBody LoginDTO loginDTO)
    {
        return service.login(loginDTO);
    }
}
