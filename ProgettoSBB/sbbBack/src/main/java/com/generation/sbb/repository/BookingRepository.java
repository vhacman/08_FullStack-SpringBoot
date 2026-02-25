package com.generation.sbb.repository;

import com.generation.sbb.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDate;


@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    @Query("SELECT b FROM Booking b WHERE b.from = ?1 AND b.room.hotel.id = ?2")
    List<Booking> findByFromAndHotelId(LocalDate from, int hotelId);

    // TODO 25-02-26
    // Aggiunto rispetto a findByFromAndHotelId (usato per gli arrivi):
    // qui il filtro è su b.to invece di b.from, perché per le partenze
    // ci interessa la data di fine soggiorno, non quella di inizio.
    @Query("SELECT b FROM Booking b WHERE b.to = ?1 AND b.room.hotel.id = ?2")
    List<Booking> findByToAndHotelId(LocalDate to, int hotelId);

}