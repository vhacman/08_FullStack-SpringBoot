package com.generation.sbb.service;

import com.generation.sbb.dto.BookingDTO;
import com.generation.sbb.mapper.BookingMapper;
import com.generation.sbb.model.Booking;
import com.generation.sbb.model.BookingStatus;
import com.generation.sbb.model.Room;
import com.generation.sbb.model.RoomStatus;
import com.generation.sbb.repository.BookingRepository;
import com.generation.sbb.repository.RoomRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

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

    // RoomRepository necessario perché ogni transizione di stato della prenotazione
    // deve aggiornare anche lo stato della camera associata.
    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingMapper bookingMapper;

    public List<BookingDTO> findTodaysDeparturesForHotel(int hotelId) {
        return bookingMapper.toDTOs(bookingRepository.findByCheckOutAndHotelId(LocalDate.now(), hotelId));
    }

    public List<BookingDTO> findTodaysArrivalForHotel(int hotelId) {
        return bookingMapper.toDTOs(bookingRepository.findByCheckInAndHotelId(LocalDate.now(), hotelId));
    }

    public List<BookingDTO> findAll() {
        return bookingMapper.toDTOs(bookingRepository.findAll());
    }

    public List<BookingDTO> findByHotelId(int hotelId) {
        return bookingMapper.toDTOs(bookingRepository.findByRoomHotelId(hotelId));
    }

    public BookingDTO findById(Integer id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));
        return bookingMapper.toDTO(booking);
    }

    public BookingDTO save(@Valid BookingDTO bookingDTO) {
        Booking booking = bookingMapper.toEntity(bookingDTO);
        // Se il DTO arriva senza status (caso tipico di creazione da frontend),
        // MapStruct chiama setStatus(null) sovrascrivendo il default dell'entità.
        // Si forza PENDING come stato iniziale: la prenotazione è inserita
        // ma non ancora accettata.
        if (booking.getStatus() == null)
            booking.setStatus(BookingStatus.PENDING);
        booking = bookingRepository.save(booking);
        return bookingMapper.toDTO(booking);
    }

    public void deleteById(Integer id) {
        bookingRepository.deleteById(id);
    }

    // ── Transizioni di stato ─────────────────────────────────────────────────
    // Metodi dedicati per ogni transizione invece di un unico changeStatus(id, stato):
    // ogni metodo valida il punto di partenza obbligatorio e contiene la logica
    // specifica di quella transizione (es. controllo data, aggiornamento lastCleaned).
    // In questo modo non è possibile saltare passaggi o passare stati arbitrari.
    //
    // ── @Transactional ───────────────────────────────────────────────────────
    // Ogni transizione scrive su due tabelle: prenotazione e camera.
    // @Transactional garantisce che le due scritture siano atomiche:
    // se una delle due fallisce, l'altra viene annullata automaticamente (rollback).
    // Senza di esso, un errore a metà lascerebbe il DB in uno stato inconsistente
    // (es. booking CHECKED_IN ma room ancora AVAILABLE).

    // PENDING → CHECKED_IN  |  room → OCCUPIED
    @Transactional
    public void acceptBooking(int id)
    {
        Booking b = findBookingOrThrow(id);
        checkStatusOrThrow(b.getStatus(), BookingStatus.PENDING, "acceptBooking");
        b.setStatus(BookingStatus.CHECKED_IN);
        bookingRepository.save(b);
        updateRoomStatus(b.getRoom(), RoomStatus.OCCUPIED);
    }

    // PENDING → CANCELED
    // La camera non cambia stato: non era mai stata occupata.
    @Transactional
    public void cancel(int id)
    {
        Booking b = findBookingOrThrow(id);
        checkStatusOrThrow(b.getStatus(), BookingStatus.PENDING, "cancel");
        b.setStatus(BookingStatus.CANCELED);
        bookingRepository.save(b);
    }

    // CHECKED_IN → CHECKED_OUT  |  room → TO_CLEAN
    // Il checkout è consentito solo dal giorno della partenza in poi,
    // per evitare checkout prematuri mentre l'ospite è ancora in stanza.
    @Transactional
    public void checkout(int id)
    {
        Booking b = findBookingOrThrow(id);
        checkStatusOrThrow(b.getStatus(), BookingStatus.CHECKED_IN, "checkout");
        if (LocalDate.now().isBefore(b.getCheckOut()))
            throw new IllegalStateException(
                "Check-out not allowed before departure date (" + b.getCheckOut() + ")");
        b.setStatus(BookingStatus.CHECKED_OUT);
        bookingRepository.save(b);
        updateRoomStatus(b.getRoom(), RoomStatus.TO_CLEAN);
    }

    // CHECKED_OUT → COMPLETE  |  room → AVAILABLE + lastCleaned = oggi
    // Chiamato quando il personale segna la camera come pulita.
    // lastCleaned viene aggiornato qui perché è l'unico punto in cui
    // una pulizia viene certificata dal flusso applicativo.
    @Transactional
    public void complete(int id)
    {
        Booking b = findBookingOrThrow(id);
        checkStatusOrThrow(b.getStatus(), BookingStatus.CHECKED_OUT, "complete");
        b.setStatus(BookingStatus.COMPLETE);
        bookingRepository.save(b);
        Room room = b.getRoom();
        room.setStatus(RoomStatus.AVAILABLE);
        room.setLastCleaned(LocalDate.now());
        roomRepository.save(room);
    }

    // ── Helper privati ───────────────────────────────────────────────────────

    private Booking findBookingOrThrow(int id)
    {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));
    }

    // Precondizione comune a tutte le transizioni: lancia eccezione se lo stato
    // corrente non è quello atteso. Centralizzato per evitare duplicazione.
    private void checkStatusOrThrow(BookingStatus current, BookingStatus expected, String action)
    {
        if (current != expected)
            throw new IllegalStateException("Cannot perform '" + action + "': booking is " + current + ", expected " + expected);
    }

    private void updateRoomStatus(Room room, RoomStatus newStatus)
    {
        room.setStatus(newStatus);
        roomRepository.save(room);
    }
}
