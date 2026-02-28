package com.generation.sbb.service;

import com.generation.sbb.dto.HotelClosureDTO;
import com.generation.sbb.model.Hotel;
import com.generation.sbb.model.HotelClosure;
import com.generation.sbb.repository.HotelClosureRepository;
import com.generation.sbb.repository.HotelRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Gestisce i periodi di chiusura hotel. Il metodo più interessante è reopenRange():
 * anziché cancellare intera una chiusura, "ritaglia" il range richiesto
 * preservando le parti esterne (split, trim, delete a seconda dei casi).
 * Questo permette al frontend di riaprire anche un singolo giorno in mezzo
 * a un periodo di chiusura lungo senza perdere il resto.
 */
@Service
public class HotelClosureService
{
    @Autowired
    private HotelClosureRepository repository;

    @Autowired
    private HotelRepository hotelRepository;

    public List<HotelClosureDTO> findByHotelId(int hotelId)
    {
        return repository.findByHotelId(hotelId).stream()
                .map(this::toDTO)
                .toList();
    }

    public HotelClosureDTO save(HotelClosureDTO dto)
    {
        LocalDate today = LocalDate.now();

        if (dto.getStartDate() == null || dto.getEndDate() == null)
            throw new IllegalArgumentException("Le date di inizio e fine sono obbligatorie");

        if (dto.getStartDate().isBefore(today))
            throw new IllegalArgumentException("Non è possibile chiudere date nel passato: la data di inizio non può essere prima di oggi");

        if (dto.getEndDate().isBefore(today))
            throw new IllegalArgumentException("Non è possibile chiudere date nel passato: la data di fine non può essere prima di oggi");

        if (dto.getEndDate().isBefore(dto.getStartDate()))
            throw new IllegalArgumentException("La data di fine non può essere precedente alla data di inizio");

        Hotel hotel = hotelRepository.findById(dto.getHotelId())
                                        .orElseThrow(() -> new EntityNotFoundException("Hotel not found: " + dto.getHotelId()));
        HotelClosure entity = new HotelClosure();
        entity.setHotel(hotel);
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setReason(dto.getReason());
        entity = repository.save(entity);
        return toDTO(entity);
    }

    public void deleteById(int id)
    {
        repository.deleteById(id);
    }

    /**
     * Riapre un range di date: "taglia" tutte le chiusure che si sovrappongono
     * a [from, to], preservando le parti esterne al range.
     *
     * Casi possibili per ogni chiusura sovrapposta:
     *   1. Chiusura completamente dentro il range → eliminata
     *   2. Range al centro della chiusura          → split in due chiusure
     *   3. Range copre la parte iniziale           → posticipa startDate
     *   4. Range copre la parte finale             → anticipa endDate
     */
    @Transactional
    public void reopenRange(int hotelId, LocalDate from, LocalDate to)
    {
        List<HotelClosure> overlapping = repository.findOverlapping(hotelId, from, to);

        for (HotelClosure c : overlapping)
        {
            // startsBefore: la chiusura inizia PRIMA del range da riaprire
            //   → significa che esiste una "testa" da preservare (da c.startDate a from-1)
            // endsAfter: la chiusura finisce DOPO il range da riaprire
            //   → significa che esiste una "coda" da preservare (da to+1 a c.endDate)
            boolean startsBefore = c.getStartDate().isBefore(from);
            boolean endsAfter    = c.getEndDate().isAfter(to);

            // Caso 2: startsBefore=true, endsAfter=true
            // La chiusura "avvolge" il range da entrambi i lati:
            //   |---c.start--- [from...to] ---c.end---|
            // Il range viene ritagliato via dal centro: rimangono testa e coda.
            // Si crea una nuova closure per la coda (to+1 → c.endDate),
            // e si accorcia la closure esistente a sola testa (c.startDate → from-1).
            if (startsBefore && endsAfter)
            {
                HotelClosure tail = new HotelClosure();
                tail.setHotel(c.getHotel());
                tail.setStartDate(to.plusDays(1));
                tail.setEndDate(c.getEndDate());
                tail.setReason(c.getReason());
                repository.save(tail);

                c.setEndDate(from.minusDays(1));
                repository.save(c);
            }
            // Caso 1: startsBefore=false, endsAfter=false
            // La chiusura è completamente contenuta nel range:
            //   [from--- c.start...c.end ---to]
            // Non c'è nulla da preservare: la closure viene eliminata.
            else if (!startsBefore && !endsAfter)
            {
                repository.delete(c);
            }
            // Caso 4: startsBefore=true, endsAfter=false
            // La chiusura inizia prima del range ma finisce dentro (o al bordo):
            //   |---c.start--- [from... c.end ...to]
            // La parte che va da c.start a from-1 rimane chiusa;
            // il resto (dal from in poi) viene riaperto accorciando c.endDate.
            else if (startsBefore)
            {
                c.setEndDate(from.minusDays(1));
                repository.save(c);
            }
            // Caso 3: startsBefore=false, endsAfter=true  (l'unico rimasto)
            // La chiusura inizia dentro il range ma finisce dopo:
            //   [from... c.start ...to] ---c.end---|
            // La parte da c.start a to viene riaperta spostando c.startDate a to+1;
            // la coda da to+1 a c.end rimane chiusa.
            else
            {
                c.setStartDate(to.plusDays(1));
                repository.save(c);
            }
        }
    }

    private HotelClosureDTO toDTO(HotelClosure c)
    {
        HotelClosureDTO dto = new HotelClosureDTO();
        dto.setId(c.getId());
        dto.setHotelId(c.getHotel().getId());
        dto.setStartDate(c.getStartDate());
        dto.setEndDate(c.getEndDate());
        dto.setReason(c.getReason());
        return dto;
    }
}
