package com.generation.people.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

/**
 * Un tratto è una caratteristica ereditaria di un genitore
 * alcuni tratti sono trasmissibili solo dal padre, altri dalla madre, altri da entrambi i genitori
 */
@Data
@Entity
public class Trait {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    private String name;
    private String description;

    // sto semplificando... in realtà dovrebbe essere n-n, Person-Trait
    @ManyToOne
    @JoinColumn(name="person_id")
    private Person person;


}
