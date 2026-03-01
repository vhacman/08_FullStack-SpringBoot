package com.generation.sbb.repository;

import com.generation.sbb.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDate;


/**
 * Repository JPA per le prenotazioni. Estende JpaRepository che fornisce
 * già le operazioni CRUD standard (save, findById, findAll, deleteById...).
 * Le query personalizzate usano JPQL (@Query) per navigare le relazioni
 * tra entità (Booking → Room → Hotel) senza scrivere SQL nativo.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    @Query("SELECT b FROM Booking b WHERE b.checkIn = ?1 AND b.room.hotel.id = ?2")
    List<Booking> findByCheckInAndHotelId(LocalDate checkIn, int hotelId);

    // TODO 25-02-26
    // Aggiunto rispetto a findByCheckInAndHotelId (usato per gli arrivi):
    // qui il filtro è su b.checkOut invece di b.checkIn, perché per le partenze
    // ci interessa la data di fine soggiorno, non quella di inizio.
    @Query("SELECT b FROM Booking b WHERE b.checkOut = ?1 AND b.room.hotel.id = ?2")
    List<Booking> findByCheckOutAndHotelId(LocalDate checkOut, int hotelId);

    List<Booking> findByRoomHotelId(int hotelId);
    //      Gab 01/03/26
    // inserita perche aggiunta lista di guest al front end visibile nella sezione ospiti
    // con possibilità di rimuovere un ospite dalla lista.
    // Soft delete: invece di rimuovere le righe dal DB, imposta deleted = true.
    // In questo modo le prenotazioni restano come traccia storica ma non compaiono
    // più nelle query normali (filtrate da @SQLRestriction su Booking).
    // @Modifying è necessario perché senza di esso Spring Data JPA assume che ogni
    // @Query sia una SELECT e lancia eccezione a runtime su UPDATE/DELETE.
    // Con @Modifying chiama executeUpdate() invece di getResultList(), e invalida
    // la cache di primo livello di Hibernate così le entità in memoria restano allineate.
    @Modifying
    @Query("UPDATE Booking b SET b.deleted = true WHERE b.guest.id = ?1")
    void softDeleteByGuestId(int guestId);

}