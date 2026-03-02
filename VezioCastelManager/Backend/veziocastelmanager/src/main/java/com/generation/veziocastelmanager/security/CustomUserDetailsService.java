package com.generation.veziocastelmanager.security;

import com.generation.veziocastelmanager.model.entities.User;
import com.generation.veziocastelmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// Spring usa questa classe per caricare l'utente durante l'autenticazione
// dobbiamo implementare UserDetailsService e il suo metodo loadUserByUsername
@Service
public class CustomUserDetailsService implements UserDetailsService
{
    @Autowired
    private UserRepository      userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
        // cerco l'utente nel database tramite username
        // se non esiste lancio UsernameNotFoundException
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // costruisco un oggetto UserDetails che Spring capisce
        // gli passo username, password e ruolo
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles("TICKET_VENDOR")  // tutti gli utenti sono venditori di biglietti
                .build();
    }
}
