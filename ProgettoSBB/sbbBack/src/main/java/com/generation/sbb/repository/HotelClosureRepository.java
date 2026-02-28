package com.generation.sbb.repository;

import com.generation.sbb.model.HotelClosure;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelClosureRepository extends JpaRepository<HotelClosure, Integer> {

    List<HotelClosure> findByHotelId(int hotelId);

    // Due range [startDate, endDate] e [from, to] si sovrappongono se:
    // startDate <= to  AND  endDate >= from
    @Query("SELECT c FROM HotelClosure c WHERE c.hotel.id = :hotelId AND c.startDate <= :to AND c.endDate >= :from")
    List<HotelClosure> findOverlapping(int hotelId, LocalDate from, LocalDate to);
}
