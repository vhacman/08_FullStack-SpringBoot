package com.generation.bloodworkbe.api;

import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.generation.bloodworkbe.dto.ExamParameterDTO;
import com.generation.bloodworkbe.service.ExamParameterService;

import jakarta.validation.ConstraintViolationException;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;


@RestController 
@RequestMapping("/bloodwork/api/examparameters")
@CrossOrigin(origins = "http://localhost:4200")
public class ExamParameterAPI 
{
    @Autowired
    ExamParameterService service;

    @PostMapping
    public ResponseEntity<Object> insert(@RequestBody ExamParameterDTO dto)
    {
        try
        {
            dto = service.insert(dto);
            return ResponseEntity.status(201).body(dto);
        }
        catch(ConstraintViolationException e)
        {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping
    public List<ExamParameterDTO> findall() 
    {
        return service.findAll();
    }
    

}
