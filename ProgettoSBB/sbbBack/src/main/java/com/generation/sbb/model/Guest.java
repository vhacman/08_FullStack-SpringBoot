package com.generation.sbb.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

/**
 * Ospite che soggiorna in hotel. Contiene i dati anagrafici necessari per la
 * registrazione: nome, cognome, codice fiscale, data di nascita e residenza.
 * Un ospite può avere più prenotazioni nel tempo (relazione gestita da Booking).
 *
 * Il soft delete è implementato tramite il campo "deleted": invece di rimuovere
 * la riga dal DB, GuestService imposta deleted = true. @SQLRestriction aggiunge
 * automaticamente "WHERE deleted = false" a tutte le query Hibernate sull'entità,
 * rendendo gli ospiti eliminati invisibili senza modificare alcun repository.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SQLRestriction("deleted = false")
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String firstName;
    private String lastName;
    private String ssn;
    private LocalDate dob;
    private String address;
    private String city;

    // Soft delete: se true l'ospite è "cancellato" ma la riga rimane nel DB.
    // Il valore di default è false: tutti i nuovi ospiti sono attivi.
    private boolean deleted = false;
}
