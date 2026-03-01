package com.generation.sbb.repository;

import com.generation.sbb.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Repository JPA per gli ospiti.
 * La findAll() eredita da JpaRepository e, grazie a @SQLRestriction su Guest,
 * restituisce automaticamente solo i guest con deleted = false.
 */
@Repository
public interface GuestRepository extends JpaRepository<Guest, Integer> {

    // Soft delete: imposta deleted = true invece di rimuovere la riga.
    // @Modifying è necessario perché senza di esso Spring Data JPA assume che ogni
    // @Query sia una SELECT e lancia eccezione a runtime su UPDATE/DELETE.
    // Con @Modifying chiama executeUpdate() invece di getResultList(), e invalida
    // la cache di primo livello di Hibernate così le entità in memoria restano allineate.
    @Modifying
    @Query("UPDATE Guest g SET g.deleted = true WHERE g.id = ?1")
    void softDeleteById(int id);
}