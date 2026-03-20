package com.generation.veziocastelmanager.service;

import com.generation.veziocastelmanager.dto.TicketDTO;
import com.generation.veziocastelmanager.mapper.TicketMapper;
import com.generation.veziocastelmanager.model.entities.Ticket;
import com.generation.veziocastelmanager.model.entities.Visitor;
import com.generation.veziocastelmanager.model.repository.TicketRepository;
import com.generation.veziocastelmanager.model.repository.VisitorRepository;
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
    private VisitorRepository   visitorRepository;

    @Autowired
    private TicketMapper        ticketMapper;

    // usato da GET /vcm/api/tickets
    // prendo tutti i biglietti dal db e li converto in DTO
    public List<TicketDTO> findAll()
    {
        return ticketMapper.toDTOs(ticketRepository.findAll());
    }

    // usato da GET /vcm/api/tickets/{id}
    // cerco il biglietto per id, se non esiste lancio un'eccezione che Spring traduce in 404
    public TicketDTO findById(int id)
    {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found with id: " + id));
        return ticketMapper.toDTO(ticket);
    }

    // usato da POST /vcm/api/tickets e PUT /vcm/api/tickets/{id}
    // converto il DTO in entità, poi chiamo applyPricePolicy() per calcolare il prezzo
    // prima di salvare — senza questa chiamata il prezzo rimane 0
    public TicketDTO save(@Valid TicketDTO ticketDTO)
    {
        Ticket ticket = ticketMapper.toEntity(ticketDTO);

        // il mapper mette nel visitor solo l'id — dobbiamo caricare il visitor completo
        // dal db per avere la dateOfBirth necessaria ad applyPricePolicy()
        Visitor visitor = visitorRepository.findById(ticket.getVisitor().getId())
                .orElseThrow(() -> new EntityNotFoundException("Visitor not found"));
        ticket.setVisitor(visitor);

        ticket.applyPricePolicy();  // 5€ se over 70, altrimenti 10€
        ticket = ticketRepository.save(ticket);
        return ticketMapper.toDTO(ticket);
    }

    // usato da DELETE /vcm/api/tickets/{id}
    public void deleteById(int id)
    {
        ticketRepository.deleteById(id);
    }

    //TODO: implementare un sistema che permetta all'utente di estrapolare le informazioni
    // di tutti i biglietti che ha prodotto in un dato giorno.
    public List<TicketDTO>      findAllForToday()
    {
        LocalDate       today = LocalDate.now();
        List<Ticket>    tickets = ticketRepository.findAllByDate(today);
        List<TicketDTO> ticketDTOs = ticketMapper.toDTOs(tickets);
        return ticketDTOs;
    }
}
