package com.generation.people.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.generation.people.dto.PersonDTO;
import com.generation.people.mapper.PersonMapper;
import com.generation.people.model.Person;
import com.generation.people.repository.PersonRepository;

@Service
public class PersonService {

    @Autowired
    PersonRepository repo;

    @Autowired
    PersonMapper mapper;

    // orElseThrow: se l'id non esiste restituiamo 404 invece di null con 200 OK
    public PersonDTO findById(int id) {
        return repo.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Persona con id " + id + " non trovata"));
    }

    // stream() apre un flusso di elementi sulla lista
    // map() trasforma ogni elemento, qui da Person a PersonDTO tramite il mapper
    // toList() chiude lo stream e raccoglie i risultati in una List
    public List<PersonDTO> findAll() {
        return repo.findAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    public List<PersonDTO> findBrothers(int id) {
        return repo.getBrothers(id).stream()
                .map(mapper::toDTO)
                .toList();
    }

    public List<PersonDTO> findSonsOf(String fatherName) {
        return repo.findSonsOfFather(fatherName).stream()
                .map(mapper::toDTO)
                .toList();
    }

    public List<PersonDTO> findByTrait(String trait) {
        return repo.findByTrait(trait).stream()
                .map(mapper::toDTO)
                .toList();
    }


    // esercizio 1: persone con almeno uno fra due tratti
    // la logica JPQL sta in PersonRepository.findByEitherTrait
    public List<PersonDTO> findByEitherTrait(String trait1, String trait2) {
        return repo.findByEitherTrait(trait1, trait2).stream()
                .map(mapper::toDTO)
                .toList();
    }


    // esercizio 2: età media al primo figlio per donne nate dopo un anno dato
    // per ognuna chiamo getParentalAge() su Person: null se non ha figli
    // sommo e conto, se count è zero lancio 404
    public double avgFirstChildAge(int year)
    {
        List<Person> women = repo.findWomenBornAfter(year);
        int sum = 0;
        int count = 0;
        for (Person p : women) {
            Integer age = p.getParentalAge();
            if (age != null) {
                sum += age;
                count++;
            }
        }
        if (count == 0)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Nessun dato disponibile per donne nate dopo il " + year);
        return (double) sum / count;
    }


    // esercizio 3: cugini primi
    // tutta la logica sta nel default method PersonRepository.getCousins
    public List<PersonDTO> findCousins(int id) {
        return repo.getCousins(id).stream()
                .map(mapper::toDTO)
                .toList();
    }


    // esercizio 4: madri con figli da uomini diversi
    // la logica JPQL con GROUP BY e COUNT DISTINCT sta in PersonRepository.findMothersWithMultipleFathers
    public List<PersonDTO> findMothersWithMultipleFathers() {
        return repo.findMothersWithMultipleFathers().stream()
                .map(mapper::toDTO)
                .toList();
    }


    // esercizio 5: persone i cui genitori differiscono di più di n anni
    // la logica JPQL con ABS sta in PersonRepository.findByParentsAgeDifference
    public List<PersonDTO> findByParentsAgeDifference(int years) {
        return repo.findByParentsAgeDifference(years).stream()
                .map(mapper::toDTO)
                .toList();
    }

}
