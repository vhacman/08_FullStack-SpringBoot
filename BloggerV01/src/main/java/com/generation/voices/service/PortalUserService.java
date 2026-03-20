package com.generation.voices.service;

import com.generation.voices.dto.PortalUserDTO;
import com.generation.voices.mapper.PortalUserMapper;
import com.generation.voices.model.PortalUser;
import com.generation.voices.repository.PortalUserRepository;
import com.generation.voices.security.PasswordHasher; // Assicurati che il package sia corretto
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Service
@Validated
public class PortalUserService {

    @Autowired
    private PortalUserRepository portalUserRepository;

    @Autowired
    private PortalUserMapper portalUserMapper;

    @Autowired
    private PasswordHasher passwordHasher;


    /**
     * Ritorna la lista di tutti gli utenti del portale in formato DTO.
     */
    public List<PortalUserDTO> findAll() {
        return portalUserMapper.toDTOs(portalUserRepository.findAll());
    }

    /**
     * Cerca un utente tramite ID. Lancia un'eccezione se non trovato.
     */
    public PortalUserDTO findById(Integer id) {
        PortalUser user = portalUserRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("PortalUser not found with id: " + id));
        return portalUserMapper.toDTO(user);
    }

    /**
     * Salva un nuovo utente o aggiorna uno esistente.
     * Cripta la password prima del salvataggio.
     */
    public PortalUserDTO save(@Valid PortalUserDTO userDTO) {
        // Hashing della password prima di trasformare in entity e salvare
        userDTO.setPassword(passwordHasher.toMD5(userDTO.getPassword()));
        
        PortalUser user = portalUserMapper.toEntity(userDTO);
        user = portalUserRepository.save(user);
        
        return portalUserMapper.toDTO(user);
    }

    /**
     * Elimina un utente tramite ID.
     */
    public void deleteById(Integer id) {
        portalUserRepository.deleteById(id);
    }


}