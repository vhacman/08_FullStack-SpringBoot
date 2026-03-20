package com.generation.sbb.security;

import com.generation.sbb.api.BookingAPI;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter 
{

    private final BookingAPI bookingAPI;

    // questo è solo UNO Dei tanti filtri possibili
    // potrebbero essercene dozzine, infatti si parla di filterChain, catena dei filtri
    // in questo filtro io analizzo la request che mi arriva
    // e decido se riconoscere l'utente o non riconoscerlo se passare avanti nella catena dei filtri, se ce ne sono altri
    // senza impostare un utente riconosciuto
    // o se invece riconoscerlo
    // devo gestire la requet, devo gestire i suoi header

    // mi serve jwtService, devo lavorare con JWT, col Json web Token
    @Autowired
    private JwtService jwtService;

    // devo preparare gli eventuali dati per l'utente loggato
    @Autowired
    private UserDetailsService userDetailsService;

    JwtAuthenticationFilter(BookingAPI bookingAPI) {
        this.bookingAPI = bookingAPI;
    }

    // doFilterInternal: esecuzione del filtro vero e proprio
    // arriva la request (piena), arriva la response (probabilmente vuota)
    // arriva la filterChain, cioè l'elenco dei filtri eseguiti e ancora da eseguire
    @Override
    protected void doFilterInternal
    (
            HttpServletRequest request, 
            HttpServletResponse response, 
            FilterChain filterChain
    )
    throws ServletException, IOException 
    {
        
        // prendo la request, nuda, per come è. Non prendo il suo JSON, la prendo TUTTA
        // header e corpo
        /*
            esempio:
            GET /sbb/api/rooms/free/1/2026-02-27/2026-02-28 HTTP/1.1
            Host: localhost:8080
            Accept: application/json
            Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJMYXVyYSIsImxhc3ROYW1lIjoiTGVvbmUiLCJob3RlbENpdHkiOiJNb256YSIsInJvbGUiOiJSRUNFUFRJT05JU1QiLCJob3RlbEFkZHJlc3MiOiJWaWEgQ2VzYXJlIEJhdHRpc3RpIiwiaWQiOjEsImhvdGVsSWQiOjEsImhvdGVsTmFtZSI6IkImQiBTdXBlcmlvciBNb256YSIsImVtYWlsIjoibGF1cmEubGVvbmVAZmFrZW1haWwuaXQiLCJ1c2VybmFtZSI6ImxsYXVyYSIsInN1YiI6ImxsYXVyYSIsImlhdCI6MTc3MjQ0MDY5NSwiZXhwIjoxNzcyNDc2Njk1fQ.7U3vux8QxnB3CuG23q7psYMJQ31r0yszWtnjKBCMGus
        */
       // prendo il valore dell'header Authorization
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // non c'è l'header Authorization, non prova neanche ad autenticarsi OPPURE
        // non usa "Bearer" che è richiesto per jwt. IO NON TI AUTENTICO, io passo al prossimo filtro
        if (authHeader == null || !authHeader.startsWith("Bearer ")) 
        {
            filterChain.doFilter(request, response); // passa avanti nella catena dei filtri
            return;
        }

        // jwt: rimuovo i primi sette caratteri
        jwt = authHeader.substring(7);
        // estraggo lo user name? come? Non mi interessa... lo estraggo
        username = jwtService.extractUsername(jwt);

        // se ho trovato uno username nel jwt e il mio securityContext è ancora vuoto...
        // ma che perdindirindina è un SecurityContextHolder?? CHE DIAVOLO è??

        // il SecurityContext è il contesto in cui Spring memorizza le autenticazioni
        // cioè l'utente loggato. Il mio scopo è registrare l'autenticazione dell'utente
        // nel context, per permettere alla API di essere eseguita.
        // NON è il CONTEXT DELLA DEPENDENCY INJECTION, è un security context, sono dati di autenticazione
        // il security context verrà utilizzato dalla security configuration
        // che cercherà se siamo loggati oppure no
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) 
        {
            // carico i dettagli dell'utente
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            // vedo se quadrano col token.
            try {
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // registro una autorizzazione e la metto nel security context
                    // e poi farò filterChain.doFilter... e passerò al prossimo ma il security context è stato
                    // riempito, e io sono LOGGATO per QUESTA request. Solo per questa.
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            catch (Exception e) {
                filterChain.doFilter(request, response);
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}