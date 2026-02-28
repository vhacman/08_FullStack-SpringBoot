package com.generation.sbb.service;

import com.generation.sbb.dto.LoginDTO;
import com.generation.sbb.dto.TokenDTO;
import com.generation.sbb.dto.UserDTO;
import com.generation.sbb.mapper.UserMapper;
import com.generation.sbb.model.User;
import com.generation.sbb.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

/**
 * Servizio per la gestione degli utenti e dell'autenticazione.
 * Il login è implementato in forma semplificata: niente JWT né Spring Security,
 * solo una verifica hash della password e restituzione di un token UUID.
 * In un sistema reale si userebbe Spring Security + JWT.
 */
@Service
@Validated
public class UserService
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordHasher passwordHasher;

    /** @return lista di tutti gli utenti del sistema */
    public List<UserDTO> findAll()
    {
        return userMapper.toDTOs(userRepository.findAll());
    }

    /**
     * @param id identificativo dell'utente
     * @return DTO dell'utente trovato
     * @throws EntityNotFoundException se nessun utente ha quell'id
     */
    public UserDTO findById(Integer id)
    {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return userMapper.toDTO(user);
    }

    /**
     * Crea o aggiorna un utente. La password viene hashata prima del salvataggio,
     * quindi non viene mai salvata in chiaro nel DB.
     * @param userDTO dati utente (validati da @Valid); la password è in chiaro
     * @return DTO dell'utente salvato
     */
    public UserDTO save(@Valid UserDTO userDTO)
    {
        userDTO.setPassword(passwordHasher.toHash(userDTO.getPassword()));
        User user = userMapper.toEntity(userDTO);
        user = userRepository.save(user);
        return userMapper.toDTO(user);
    }

    /**
     * @param id identificativo dell'utente da eliminare
     */
    public void deleteById(Integer id)
    {
        userRepository.deleteById(id);
    }

    /**
     * Verifica username e password, restituisce un token di sessione.
     * La password ricevuta viene hashata e confrontata con quella nel DB.
     * Per ora il token è un semplice UUID: in produzione si userebbe un JWT.
     * @param loginDTO credenziali di accesso (username + password in chiaro)
     * @return TokenDTO con il token da usare nelle richieste successive
     * @throws EntityNotFoundException se lo username non esiste
     * @throws RuntimeException se la password non corrisponde
     */
    public TokenDTO login(LoginDTO loginDTO)
    {
        User user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!user.getPassword().equals(passwordHasher.toHash(loginDTO.getPassword())))
            throw new RuntimeException("Invalid password");

        // In un sistema reale qui genereresti un JWT. Per ora usiamo un UUID come token di sessione.
        return new TokenDTO(UUID.randomUUID().toString());
    }
}
