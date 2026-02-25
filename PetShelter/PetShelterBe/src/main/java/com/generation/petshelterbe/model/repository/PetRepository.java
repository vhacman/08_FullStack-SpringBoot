package com.generation.petshelterbe.model.repository;

import com.generation.petshelterbe.model.entities.Pet;
import com.generation.petshelterbe.model.enums.PetSex;
import com.generation.petshelterbe.model.enums.PetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PetRepository extends JpaRepository<Pet,Integer>
{
    // Spring Data JPA genera automaticamente la query SQL a partire dal nome del metodo.
    // findByStatus → SELECT * FROM pet WHERE status = ?
    // Non serve scrivere nessuna query manualmente: basta rispettare la convenzione
    // findBy + NomeCampo dell'entità.
    List<Pet> findByStatus(PetStatus status);

    // SELECT * FROM pet WHERE species = ?
    List<Pet> findBySpecies(String species);

    // SELECT * FROM pet WHERE sex = ?
    List<Pet> findBySex(PetSex sex);
}
