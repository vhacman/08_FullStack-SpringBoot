package com.generation.sbb.repository;

import com.generation.sbb.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDate;


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

}