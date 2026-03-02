package com.generation.veziocastelmanager.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// questo filtro viene eseguito una volta per ogni richiesta che arriva
// il suo compito è leggere il token JWT dall'header e autenticare l'utente
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter
{
    @Autowired
    private JwtService              jwtService;

    // mi serve per caricare i dati dell'utente dal database dato lo username
    @Autowired
    private UserDetailsService      userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException
    {
        // prendo l'header Authorization dalla richiesta
        final String authHeader = request.getHeader("Authorization");

        // se non c'è l'header oppure non inizia con "Bearer " non provo nemmeno ad autenticare
        // passo direttamente al filtro successivo
        if (authHeader == null || !authHeader.startsWith("Bearer "))
        {
            filterChain.doFilter(request, response);
            return;
        }

        // tolgo i primi 7 caratteri ("Bearer ") e mi rimane solo il token
        final String jwt      = authHeader.substring(7);
        // estraggo lo username dal token
        final String username = jwtService.extractUsername(jwt);

        // se ho trovato uno username e l'utente non è già autenticato in questa richiesta
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null)
        {
            // carico i dati dell'utente dal database
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // verifico che il token sia valido per quell'utente
            if (jwtService.isTokenValid(jwt, userDetails))
            {
                // creo il token di autenticazione di Spring con i dati dell'utente e i suoi permessi
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                // aggiungo i dettagli della richiesta (ip, ecc.)
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // registro l'utente come autenticato nel security context per questa richiesta
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // passo al filtro successivo in ogni caso
        filterChain.doFilter(request, response);
    }
}
