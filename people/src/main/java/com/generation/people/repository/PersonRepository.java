package com.generation.people.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.generation.people.model.Person;

public interface PersonRepository extends JpaRepository<Person, Integer>{

    // differenza fondamentale JPQL vs SQL:
    // SQL legge RIGHE di tabelle, JPQL legge OGGETTI JPA
    // JPQL può navigare le relazioni con la dot-notation (p.father.firstName)
    // e Hibernate traduce tutto in JOIN SQL automaticamente

    @Query("SELECT p FROM Person p WHERE p.father.id = :fatherId AND p.mother.id = :motherId")
    List<Person> findByMotherIdAndFatherId(int fatherId, int motherId);

    // p.father.firstName non richiede JOIN esplicito,
    // Hibernate genera: INNER JOIN person father ON father.id = child.father_id
    //                   WHERE father.first_name = :fatherName
    @Query("SELECT p FROM Person p WHERE p.father.firstName = :fatherName")
    List<Person> findSonsOfFather(String fatherName);

    // subquery correlata: per ogni Person p cerco se esiste almeno un Trait t
    // legato a quella persona con il nome cercato
    // "t.person.id = p.id" è la correlazione tra query esterna e subquery
    @Query("SELECT p FROM Person p where :traitName in (select t.name from Trait t where t.person.id = p.id)")
    List<Person> findByTrait(String traitName);


    // esercizio 1: trovare tutte le persone che abbiano uno fra due tratti specifici
    // stessa logica di findByTrait ma con OR tra le due subquery correlate
    // chiamato da PersonService.findByEitherTrait, esposto su GET /api/people/either-trait
    @Query("SELECT p FROM Person p "                                                        +
           "WHERE :trait1 IN (SELECT t.name FROM Trait t WHERE t.person.id = p.id) "        +
           "   OR :trait2 IN (SELECT t.name FROM Trait t WHERE t.person.id = p.id)")
    List<Person> findByEitherTrait(String trait1, String trait2);


    // esercizio 2: trovare l'età media a cui una donna nata dopo il 1980 ha avuto il primo figlio
    // il filtro gender = 'F' è dentro la query così il service non passa "F" hardcoded
    // il calcolo della media lo fa PersonService.avgAgeAtFirstChildForWomenBornAfter usando getParentalAge()
    // esposto su GET /api/people/avg-parental-age
    @Query("SELECT p FROM Person p WHERE p.gender = 'F' AND p.birthYear > :birthYear")
    List<Person> findWomenBornAfter(int birthYear);


    // esercizio 3: trovare tutti i cugini primi di una persona data
    // un cugino primo è figlio di uno zio, uno zio è fratello di un genitore
    // algoritmo: prendo i fratelli del padre (zii paterni) e i fratelli della madre (zie materne),
    // poi raccolgo tutti i loro figli
    // riusa getBrothers già esistente e getChildren su Person
    // chiamato da PersonService.findCousins, esposto su GET /api/people/{id}/cousins
    default List<Person> getCousins(int id) {
        Optional<Person> personOpt = findById(id);
        if (personOpt.isEmpty())
            return new ArrayList<>();
        Person p = personOpt.get();
        List<Person> cousins = new ArrayList<>();

        // zii paterni: fratelli del padre
        if (p.getFather() != null) {
            List<Person> paternalUncles = getBrothers(p.getFather().getId());
            for (Person uncle : paternalUncles)
                cousins.addAll(uncle.getChildren());
        }

        // zie materne: fratelli/sorelle della madre
        if (p.getMother() != null) {
            List<Person> maternalAunts = getBrothers(p.getMother().getId());
            for (Person aunt : maternalAunts)
                cousins.addAll(aunt.getChildren());
        }

        return cousins;
    }


    // esercizio 4: trovare tutte le donne che abbiano avuto figli da uomini diversi
    // raggruppo i figli per madre con GROUP BY, poi conto quanti padri distinti ha ogni gruppo
    // COUNT(p.father) conta tutte le righe, COUNT(DISTINCT p.father) conta solo i valori diversi
    // esempio: Sofia ha 3 figli, 2 con Ferdinando e 1 con Bruno
    //   COUNT(p.father) = 3, COUNT(DISTINCT p.father) = 2
    // HAVING > 1 tiene solo le madri con almeno 2 padri diversi
    // IS NOT NULL esclude i figli senza padre registrato
    // chiamato da PersonService.findMothersWithMultipleFathers, esposto su GET /api/people/multiple-fathers
    @Query("SELECT p.mother FROM Person p " +
           "WHERE p.mother IS NOT NULL AND p.father IS NOT NULL " +
           "GROUP BY p.mother " +
           "HAVING COUNT(DISTINCT p.father) > 1")
    List<Person> findMothersWithMultipleFathers();


    // esercizio 5: trovare tutte le persone i cui genitori abbiano una differenza di età superiore a n anni
    // ABS() calcola il valore assoluto, funziona sia se il padre è più vecchio che più giovane della madre
    // i controlli IS NOT NULL sono espliciti: senza di loro se un genitore manca
    // ABS restituirebbe null e la riga verrebbe scartata silenziosamente
    // chiamato da PersonService.findByParentsAgeDifference, esposto su GET /api/people/parents-age-diff
    @Query("SELECT p FROM Person p " +
           "WHERE p.father IS NOT NULL " +
           "  AND p.mother IS NOT NULL " +
           "  AND ABS(p.father.birthYear - p.mother.birthYear) > :years")
    List<Person> findByParentsAgeDifference(int years);


    // recupera la persona, legge i suoi genitori, cerca tutte le persone con gli stessi genitori
    // poi rimuove la persona stessa dal risultato
    // usato internamente da getCousins e da PersonService.findBrothers
    default List<Person> getBrothers(int id) {
        Optional<Person> person = findById(id);
        if (person.isEmpty())
            // List.of() restituisce una lista vuota immutabile, più efficiente di new ArrayList<>()
            // va bene qui perché nessuno aggiunge elementi alla lista restituita
            return List.of();
        Person p = person.get();
        if (p.getFather() == null || p.getMother() == null)
            return List.of();
        int fatherId = p.getFather().getId();
        int motherId = p.getMother().getId();
        List<Person> res = findByMotherIdAndFatherId(fatherId, motherId);
        res.remove(p);
        return res;
    }

}
