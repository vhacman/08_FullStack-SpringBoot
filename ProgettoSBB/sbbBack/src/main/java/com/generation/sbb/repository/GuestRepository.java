package com.generation.sbb.repository;

import com.generation.sbb.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository JPA per gli ospiti. Non servono query personalizzate:
 * le operazioni CRUD standard di JpaRepository coprono tutti i casi d'uso attuali.
 */
@Repository
public interface GuestRepository extends JpaRepository<Guest, Integer> {
}