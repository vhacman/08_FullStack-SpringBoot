package com.generation.veziocastelmanager.service;

import com.generation.veziocastelmanager.dto.TicketDTO;
import com.generation.veziocastelmanager.mapper.TicketMapper;
import com.generation.veziocastelmanager.model.entities.Ticket;
import com.generation.veziocastelmanager.repository.TicketRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.util.List;

@Service
@Validated
public class TicketService
{
    @Autowired
    private TicketRepository    ticketRepository;

    @Autowired
    private TicketMapper        ticketMapper;

    public List<TicketDTO> findAll()
    {
        return ticketMapper.toDTOs(ticketRepository.findAll());
    }

    public TicketDTO findById(int id)
    {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Ticket not found with id: " + id));
        return ticketMapper.toDTO(ticket);
    }

    public List<TicketDTO> findBySellerId(int sellerId)
    {
        return ticketMapper.toDTOs(ticketRepository.findBySellerId(sellerId));
    }

    public List<TicketDTO> findByVisitorId(int visitorId)
    {
        return ticketMapper.toDTOs(ticketRepository.findByVisitorId(visitorId));
    }

    public List<TicketDTO> findByDate(LocalDate date)
    {
        return ticketMapper.toDTOs(ticketRepository.findByDate(date));
    }

    public TicketDTO save(@Valid TicketDTO ticketDTO)
    {
        Ticket ticket = ticketMapper.toEntity(ticketDTO);
        ticket        = ticketRepository.save(ticket);
        return ticketMapper.toDTO(ticket);
    }

    public void deleteById(int id)
    {
        ticketRepository.deleteById(id);
    }
}
