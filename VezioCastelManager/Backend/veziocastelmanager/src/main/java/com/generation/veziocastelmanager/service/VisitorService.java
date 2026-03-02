package com.generation.veziocastelmanager.service;

import com.generation.veziocastelmanager.dto.VisitorDTO;
import com.generation.veziocastelmanager.mapper.VisitorMapper;
import com.generation.veziocastelmanager.model.entities.Visitor;
import com.generation.veziocastelmanager.repository.VisitorRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Service
@Validated
public class VisitorService
{
    @Autowired
    private VisitorRepository   visitorRepository;

    @Autowired
    private VisitorMapper       visitorMapper;

    public List<VisitorDTO> findAll()
    {
        return visitorMapper.toDTOs(visitorRepository.findAll());
    }

    public VisitorDTO findById(int id)
    {
        Visitor visitor = visitorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Visitor not found with id: " + id));
        return visitorMapper.toDTO(visitor);
    }

    public List<VisitorDTO> findByLastName(String lastName)
    {
        return visitorMapper.toDTOs(visitorRepository.findByLastName(lastName));
    }

    public VisitorDTO save(@Valid VisitorDTO visitorDTO)
    {
        Visitor visitor = visitorMapper.toEntity(visitorDTO);
        visitor         = visitorRepository.save(visitor);
        return visitorMapper.toDTO(visitor);
    }

    public void deleteById(int id)
    {
        visitorRepository.deleteById(id);
    }
}
