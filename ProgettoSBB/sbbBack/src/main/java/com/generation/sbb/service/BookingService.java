package com.generation.sbb.service;

import com.generation.sbb.dto.BookingDTO;
import com.generation.sbb.mapper.BookingMapper;
import com.generation.sbb.model.Booking;
import com.generation.sbb.repository.BookingRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingMapper bookingMapper;

    // TODO 25-02-26
    // Aggiunto rispetto a findTodaysArrivalForHotel:
    // chiama findByToAndHotelId invece di findByFromAndHotelId,
    // perché le partenze si filtrano sulla data di fine soggiorno (b.to).
    public List<BookingDTO> findTodaysDeparturesForHotel(int hotelId){
        return bookingMapper.toDTOs(bookingRepository.findByToAndHotelId(LocalDate.now(), hotelId));
    }

    public List<BookingDTO> findTodaysArrivalForHotel(int hotelId){
        return bookingMapper.toDTOs(bookingRepository.findByFromAndHotelId(LocalDate.now(), hotelId));
    }

    public List<BookingDTO> findAll() {
        return bookingMapper.toDTOs(bookingRepository.findAll());
    }

    public BookingDTO findById(Integer id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));
        return bookingMapper.toDTO(booking);
    }

    public BookingDTO save(@Valid BookingDTO bookingDTO) {
        Booking booking = bookingMapper.toEntity(bookingDTO);
        booking = bookingRepository.save(booking);
        return bookingMapper.toDTO(booking);
    }

    public void deleteById(Integer id) {
        bookingRepository.deleteById(id);
    }

    public void changeStatus(int id, String status) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));
        b.setStatus(status);
        bookingRepository.save(b);
    }

    // Ho aggiunto questo metodo separato da changeStatus perché le pulizie non sono
    // uno "stato" della prenotazione ma un campo indipendente.
    // Avrei potuto riusare changeStatus, ma sarebbe stato semanticamente sbagliato:
    // cleaned è un boolean, non una stringa di stato. Tenerli separati rende il codice
    // più chiaro e rispetta il principio di singola responsabilità (ogni metodo fa una cosa sola).
    public void setCleaned(int id) {
        Booking b = bookingRepository.findById(id)
                // orElseThrow: se la prenotazione non esiste lancio un'eccezione
                // che il controller catturerà e trasformerà in un 404.
                // È il modo corretto per gestire il caso "risorsa non trovata" in REST.
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));
        // Setto solo cleaned a true, il resto della prenotazione rimane intatto.
        // Questo è esattamente il caso d'uso di PATCH: modifica parziale di una risorsa.
        b.setCleaned(true);
        bookingRepository.save(b);
    }

}
