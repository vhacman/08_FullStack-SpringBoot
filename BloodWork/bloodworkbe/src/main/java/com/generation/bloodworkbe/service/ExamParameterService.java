package com.generation.bloodworkbe.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import com.generation.bloodworkbe.dto.ExamParameterDTO;
import com.generation.bloodworkbe.mapper.ExamParameterMapper;
import com.generation.bloodworkbe.model.ExamParameter;
import com.generation.bloodworkbe.repository.ExamParameterRepository;

import jakarta.validation.Valid;

@Service
@Validated
public class ExamParameterService 
{
    @Autowired
    ExamParameterRepository examParameterRepository;

    @Autowired
    ExamParameterMapper mapper;

    // valid fa il controllo con tutte le annotation che abbiamo visto prima
    // se non le rispetta darà una eccezione particolare
    // che si chiama ConstraintViolationException
    // l'eccezione viene generata AUTOMATICAMENTE
    public ExamParameterDTO insert(@Valid ExamParameterDTO dto)
    {
        ExamParameter parameter = mapper.fromDTO(dto);
        parameter = examParameterRepository.save(parameter);
        return mapper.toDTO(parameter);
    }

    public List<ExamParameterDTO> findAll()
    {
        return mapper.toDTO(examParameterRepository.findAll());    
    }

}
