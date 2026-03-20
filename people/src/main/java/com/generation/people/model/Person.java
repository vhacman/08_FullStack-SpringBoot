package com.generation.people.model;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
@Entity
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    private String firstName, lastName;
    private int birthYear;
    private String gender;

    @OneToMany(mappedBy = "father")
    private List<Person> fatherChildren;

    @OneToMany(mappedBy = "mother")
    private List<Person> motherChildren;

    @ManyToOne
    @JoinColumn(name="father_id")
    private Person father;

    @ManyToOne
    @JoinColumn(name="mother_id")
    private Person mother;

    @OneToMany(mappedBy = "person")
    private List<Trait> traits;

    public List<Person> getChildren(){
        List<Person> res = new ArrayList<Person>();
        if(fatherChildren!=null)
            res.addAll(fatherChildren);
        if(motherChildren!=null)
            res.addAll(motherChildren);
        return res;
    }
    // età in cui sono diventato genitore
    @JsonIgnore
    public Integer getParentalAge(){
        
        List<Person> children = getChildren();
        if(children.size()==0)
            return null;

        Comparator<Person> byAge = (p1, p2) -> p1.getBirthYear() - p2.getBirthYear();
        children.sort(byAge);
        return children.get(0).getBirthYear() - getBirthYear();
    }


}
