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

@Service
public class HotelClosureService {

    @Autowired
    private HotelClosureRepository repository;

    @Autowired
    private HotelRepository hotelRepository;

    public List<HotelClosureDTO> findByHotelId(int hotelId) {
        return repository.findByHotelId(hotelId).stream()
                .map(this::toDTO)
                .toList();
    }

    public HotelClosureDTO save(HotelClosureDTO dto) {
        LocalDate today = LocalDate.now();
        
        if (dto.getStartDate() == null || dto.getEndDate() == null) {
            throw new IllegalArgumentException("Le date di inizio e fine sono obbligatorie");
        }
        
        if (dto.getStartDate().isBefore(today)) {
            throw new IllegalArgumentException("Non è possibile chiudere date nel passato: la data di inizio non può essere prima di oggi");
        }
        
        if (dto.getEndDate().isBefore(today)) {
            throw new IllegalArgumentException("Non è possibile chiudere date nel passato: la data di fine non può essere prima di oggi");
        }
        
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new IllegalArgumentException("La data di fine non può essere precedente alla data di inizio");
        }
        
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

    public void deleteById(int id) {
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
    public void reopenRange(int hotelId, LocalDate from, LocalDate to) {
        List<HotelClosure> overlapping = repository.findOverlapping(hotelId, from, to);

        for (HotelClosure c : overlapping) {
            boolean startsBefore = c.getStartDate().isBefore(from);
            boolean endsAfter    = c.getEndDate().isAfter(to);

            if (startsBefore && endsAfter) {
                // Caso 2: il range è dentro la chiusura → split
                HotelClosure tail = new HotelClosure();
                tail.setHotel(c.getHotel());
                tail.setStartDate(to.plusDays(1));
                tail.setEndDate(c.getEndDate());
                tail.setReason(c.getReason());
                repository.save(tail);

                c.setEndDate(from.minusDays(1));
                repository.save(c);

            } else if (!startsBefore && !endsAfter) {
                // Caso 1: chiusura completamente nel range → elimina
                repository.delete(c);

            } else if (startsBefore) {
                // Caso 4: la chiusura inizia prima del range → accorcia la coda
                c.setEndDate(from.minusDays(1));
                repository.save(c);

            } else {
                // Caso 3: la chiusura finisce dopo il range → sposta l'inizio
                c.setStartDate(to.plusDays(1));
                repository.save(c);
            }
        }
    }

    private HotelClosureDTO toDTO(HotelClosure c) {
        HotelClosureDTO dto = new HotelClosureDTO();
        dto.setId(c.getId());
        dto.setHotelId(c.getHotel().getId());
        dto.setStartDate(c.getStartDate());
        dto.setEndDate(c.getEndDate());
        dto.setReason(c.getReason());
        return dto;
    }
}
