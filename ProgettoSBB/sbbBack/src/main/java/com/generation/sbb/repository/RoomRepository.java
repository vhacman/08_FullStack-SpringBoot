package com.generation.sbb.repository;

import com.generation.sbb.model.Room;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Repository JPA per le camere.
 * Contiene una query custom per trovare le camere libere in un dato periodo,
 * usata dal RoomPicker quando si crea una nuova prenotazione.
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {

    // ?1, ?2, ?3 sono parametri posizionali JPQL: corrispondono nell'ordine
    // al primo, secondo e terzo parametro del metodo (hotelId, checkIn, checkOut).
    // È l'alternativa ai parametri nominali (:nomeParametro): stessa funzione,
    // sintassi più compatta ma meno leggibile su query lunghe.
    //
    // Equivalente con parametri nominali (più leggibile):
    // @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r NOT IN " +
    //        "(SELECT b.room FROM Booking b WHERE b.checkIn < :checkOut AND b.checkOut > :checkIn)")
    // List<Room> findFreeRoomsInHotel(@Param("hotelId") int hotelId,
    //                                 @Param("checkIn") LocalDate checkIn,
    //                                 @Param("checkOut") LocalDate checkOut);
    //
    // La logica: prendi tutte le camere dell'hotel (?1), escludi quelle che
    // compaiono in almeno una prenotazione attiva che si sovrappone al periodo.
    //
    // Due soggiorni si sovrappongono se:  checkIn_B < checkOut_A  AND  checkOut_B > checkIn_A
    // (stesso ragionamento per inversione dei casi di non-overlap usato in HotelClosureRepository)
    //
    // Qui applicato alla subquery:   b.checkIn < ?3 (checkOut richiesto)
    //                            AND b.checkOut > ?2 (checkIn richiesto)
    @Query("SELECT r FROM Room r WHERE r.hotel.id = ?1 AND r NOT IN (SELECT b.room FROM Booking b WHERE b.checkIn < ?3 AND b.checkOut > ?2)")
    List<Room> findFreeRoomsInHotel(int hotelId, LocalDate checkIn, LocalDate checkOut);
}