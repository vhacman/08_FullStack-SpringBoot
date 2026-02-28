package com.generation.sbb.repository;

import com.generation.sbb.model.HotelClosure;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Repository JPA per i periodi di chiusura hotel.
 * La query findOverlapping() è il pezzo più tecnico: usa la condizione di
 * sovrapposizione tra intervalli (startDate <= to AND endDate >= from) che
 * copre tutti i casi possibili (inclusione, parziale sinistro/destro, uguale).
 */
@Repository
public interface HotelClosureRepository extends JpaRepository<HotelClosure, Integer> {

    List<HotelClosure> findByHotelId(int hotelId);

    // Trova tutte le closure che "toccano" il range [from, to].
    //
    // Invece di elencare tutti i modi in cui due periodi possono sovrapporsi
    // (sono tanti), è più semplice ragionare al contrario: quando NON si sovrappongono?
    // Solo in due casi:
    //
    //   caso A — la closure finisce PRIMA che il range inizi:
    //            |--closure--|   |--from...to--|
    //            endDate < from
    //
    //   caso B — la closure inizia DOPO che il range finisce:
    //            |--from...to--|   |--closure--|
    //            startDate > to
    //
    // Quindi si sovrappongono quando NON è né A né B, ovvero:
    //   NOT (endDate < from  OR  startDate > to)
    //   →   endDate >= from  AND  startDate <= to
    //
    // Questa è esattamente la condizione nella query.
    @Query("SELECT c FROM HotelClosure c WHERE c.hotel.id = :hotelId AND c.startDate <= :to AND c.endDate >= :from")
    List<HotelClosure> findOverlapping(int hotelId, LocalDate from, LocalDate to);
}
