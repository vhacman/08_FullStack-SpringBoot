package com.generation.sbb.repository;

import com.generation.sbb.model.Room;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {

    @Query("SELECT r FROM Room r WHERE r.hotel.id = ?1 AND r NOT IN (SELECT b.room FROM Booking b WHERE b.checkIn < ?3 AND b.checkOut > ?2)")
    List<Room> findFreeRoomsInHotel(int hotelId, LocalDate checkIn, LocalDate checkOut);
}