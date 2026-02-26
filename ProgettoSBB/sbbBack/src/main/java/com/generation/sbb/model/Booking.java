package com.generation.sbb.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "guest_id")
    private Guest guest;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "booking_from")
    private LocalDate from;

    @Column(name = "booking_to")
    private LocalDate to;

    @Min(value=0, message="Price cannot be negative")
    private int price;

    private String notes;

    private String status = "SCHEDULED";

    // Ho aggiunto questo campo per tracciare se la camera è stata pulita dopo il checkout.
    // È un boolean perché lo stato è binario: o è stata pulita o non lo è ancora.
    // Il default è false perché quando una prenotazione viene creata la camera non è
    // ancora stata liberata, quindi non può essere pulita.
    // Hibernate creerà automaticamente la colonna "cleaned" nel DB grazie a ddl-auto=update.
    private boolean cleaned = false;
}
