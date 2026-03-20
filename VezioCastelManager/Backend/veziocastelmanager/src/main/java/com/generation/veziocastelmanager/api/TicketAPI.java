package com.generation.veziocastelmanager.api;

import com.generation.veziocastelmanager.dto.TicketDTO;
import com.generation.veziocastelmanager.service.TicketService;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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

import java.util.List;

@RestController
@RequestMapping("/vcm/api/tickets")
@CrossOrigin(origins = "http://localhost:4200")
public class TicketAPI {
    @Autowired
    private TicketService service;

    // GET /vcm/api/tickets — ritorna tutti i biglietti
    // no try-catch: la findAll non ha logica che può lanciare eccezioni gestibili
    @GetMapping
    public List<TicketDTO> findAll() {
        return service.findAll();
    }

    // GET /vcm/api/tickets/{id} — ritorna un biglietto per id
    // no try-catch: se l'id non esiste, il service ritorna null e Spring gestisce il resto
    @GetMapping("/{id}")
    public TicketDTO findById(@PathVariable int id) {
        return service.findById(id);
    }

    // POST /vcm/api/tickets — crea un nuovo biglietto
    // try-catch necessario: la validazione dei campi del DTO può lanciare ConstraintViolationException
    // in quel caso vogliamo restituire 400 con il messaggio di errore invece di un 500 generico
    @PostMapping
    public ResponseEntity<Object> save(@RequestBody TicketDTO dto) {
        try {
            dto = service.save(dto);
            return ResponseEntity.status(201).body(dto);
        } catch (ConstraintViolationException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    // PUT /vcm/api/tickets/{id} — aggiorna un biglietto esistente
    // try-catch necessario: stessa ragione del POST, i dati aggiornati devono essere validati
    // e vogliamo restituire 400 in caso di dati non validi
    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable int id, @RequestBody TicketDTO dto) {
        try {
            dto.setId(id);
            dto = service.save(dto);
            return ResponseEntity.ok(dto);
        } catch (ConstraintViolationException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    // DELETE /vcm/api/tickets/{id} — elimina un biglietto, ritorna 204 senza corpo
    // no try-catch: la delete non ritorna dati e non ha validazioni da gestire
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // GET /vcm/api/tickets/today — ritorna tutti i biglietti di oggi
    // no try-catch: la data viene calcolata internamente, non ci sono input esterni da validare
    @GetMapping("/today")
    public ResponseEntity<List<TicketDTO>> findAllForToday() {
        List<TicketDTO> ticketDTOs = service.findAllForToday();
        return ResponseEntity.ok(ticketDTOs);
    }

    // GET /vcm/api/tickets/export/xml — esporta tutti i biglietti in formato XML
    // "produces" dice a Spring che la risposta deve essere serializzata in XML
    // invece del solito JSON — questo funziona grazie alla dipendenza jackson-dataformat-xml
    @GetMapping(value = "/export/xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<List<TicketDTO>> exportAllAsXml()
    {
        // recupera tutti i biglietti dal service, già mappati in DTO
        List<TicketDTO> ticketDTOs = service.findAll();

        // restituisce 200 OK con la lista dei biglietti nel corpo della risposta
        // Spring si occupa automaticamente di convertire la lista in XML
        // grazie al MessageConverter registrato da jackson-dataformat-xml
        return ResponseEntity.ok(ticketDTOs);
    }
}