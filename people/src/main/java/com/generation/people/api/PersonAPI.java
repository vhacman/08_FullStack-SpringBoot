package com.generation.people.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.generation.people.dto.PersonDTO;
import com.generation.people.service.PersonService;


@RestController
@RequestMapping("/api/people")
public class PersonAPI {

    @Autowired
    PersonService service;

    @GetMapping("/test")
    public PersonDTO load2(){
        return service.findById(2);
    }

    @GetMapping("/test2")
    public List<PersonDTO> getMatthewBrothers() {
        return service.findBrothers(2);
    }

    @GetMapping("/test3")
    public List<PersonDTO> getFerdinandosChildren() {
        return service.findSonsOf("Ferdinando");
    }

    @GetMapping("/test4")
    public List<PersonDTO> getMiopi(){
        return service.findByTrait("Miopia");
    }


    // esercizio 1: persone con almeno uno fra due tratti
    // i due tratti arrivano come query param, esempio: ?trait1=Miopia&trait2=Presbiopia
    @GetMapping("/either-trait")
    public List<PersonDTO> getByEitherTrait(@RequestParam String trait1, @RequestParam String trait2) {
        return service.findByEitherTrait(trait1, trait2);
    }


    // esercizio 2: età media al primo figlio per donne nate dopo un anno
    // il 404 viene lanciato dal service se nessuna donna del gruppo ha figli
    @GetMapping("/avg-parental-age")
    public double getAvgParentalAge(@RequestParam int year) {
        return service.avgFirstChildAge(year);
    }


    // esercizio 3: cugini primi di una persona, l'id è parte del path
    @GetMapping("/{id}/cousins")
    public List<PersonDTO> getCousins(@PathVariable int id) {
        return service.findCousins(id);
    }


    // esercizio 4: madri che hanno avuto figli da uomini diversi
    @GetMapping("/multiple-fathers")
    public List<PersonDTO> getMothersWithMultipleFathers() {
        return service.findMothersWithMultipleFathers();
    }


    // esercizio 5: persone i cui genitori differiscono di più di n anni, n arriva come query param
    @GetMapping("/parents-age-diff")
    public List<PersonDTO> getByParentsAgeDifference(@RequestParam int years) {
        return service.findByParentsAgeDifference(years);
    }

}
