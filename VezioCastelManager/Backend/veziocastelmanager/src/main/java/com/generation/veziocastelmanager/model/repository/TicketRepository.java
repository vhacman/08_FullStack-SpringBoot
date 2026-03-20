package com.generation.veziocastelmanager.model.repository;

import com.generation.veziocastelmanager.model.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer>
{
    //TODO: implementare un sistema che permetta all'utente di estrapolare le informazioni
    // di tutti i biglietti che ha prodotto in un dato giorno.

    //04-03-26
    //metodo per trovare tutti i ticket di una data giornata
    List<Ticket> findAllByDate(LocalDate date);

}
