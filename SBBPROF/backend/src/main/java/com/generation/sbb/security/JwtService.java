package com.generation.sbb.security;

import com.generation.sbb.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    /*
     * La chiave segreta viene iniettata dal file application.properties tramite @Value.
     * In questo modo il valore NON è hardcodato nella sorgente
     * Nel file application.properties:
     *   jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
     */
    @Value("${jwt.secret}")
    private String SECRET;

    /*
     * Numero massimo di ore dopo cui un token viene rifiutato,
     * anche se tecnicamente non ancora scaduto secondo il claim "exp".
     * Forza un re-login periodico per aumentare la sicurezza.
     */
    private static final int MAX_TOKEN_AGE_HOURS = 24;

    /*
     * Genera un JWT per l'utente passato come parametro.
     *
     * Un JWT è composto da tre parti separate da punti:
     *   [HEADER].[PAYLOAD].[FIRMA]
     *
     * - HEADER: algoritmo usato (HS256) e tipo di token
     * - PAYLOAD: i "claims", cioè i dati dell'utente + metadati (iat, exp, sub)
     * - FIRMA: hash di header+payload firmato con il SECRET → garantisce integrità
     *
     * ATTENZIONE: header e payload sono solo codificati in Base64, NON cifrati.
     * Chiunque può decodificarli su jwt.io — la firma garantisce solo che
     * il token non sia stato manomesso, non che sia segreto.
     */
    public String generateToken(User user) {
        // Verifica che l'utente non sia nullo
        if (user == null)
            throw new IllegalArgumentException("User non può essere null");

        // Verifica che i campi obbligatori ci siano
        if (user.getUsername() == null || user.getUsername().isBlank())
            throw new IllegalArgumentException("Username obbligatorio per generare il token");

        // Verifica che il ruolo non sia null (causerebbe un claim null nel payload)
        if (user.getRole() == null)
            throw new IllegalArgumentException("Il ruolo dell'utente è obbligatorio");

        // Mappa dei claims custom che aggiungiamo al payload
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());
        claims.put("username", user.getUsername());
        claims.put("role", user.getRole());         // Il ruolo è usato per l'autorizzazione
        claims.put("quote", "Amo il profumo del napalm al mattino"); // Claim custom
        claims.put("email", user.getEmail());       // ⚠️ Visibile a chiunque decodifichi il token

        // Se l'utente è associato a un hotel (es. receptionist), aggiungiamo i dati hotel.
        // Questo evita una chiamata extra al backend per sapere a quale hotel appartiene l'utente.
        if (user.getHotel() != null) {
            claims.put("hotelId", user.getHotel().getId());
            claims.put("hotelName", user.getHotel().getName());
            claims.put("hotelAddress", user.getHotel().getAddress());
            claims.put("hotelCity", user.getHotel().getCity());
        }

        long now = System.currentTimeMillis();

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername())              // "sub": identificativo principale del token
                .setIssuedAt(new Date(now))                  // "iat": momento di emissione
                .setNotBefore(new Date(now))                 // "nbf": il token è valido da subito
                .setExpiration(new Date(now + 1000 * 60 * 60 * 10)) // "exp": scade tra 10 ore
                .signWith(getSignKey(), SignatureAlgorithm.HS256)     // Firma con HMAC-SHA256
                .compact();                                  // Serializza in stringa Base64Url
    }

    /*
     * Estrae il campo "sub" (subject) dal token, che corrisponde all'username dell'utente.
     * Usato per identificare l'utente durante la validazione della richiesta.
     */
    public String extractUsername(String token) {
        if (token == null || token.isBlank())
            throw new IllegalArgumentException("Token non può essere nullo o vuoto");
        return extractClaim(token, Claims::getSubject);
    }

    /*
     * Metodo generico per estrarre qualsiasi claim dal token.
     * Accetta una funzione (lambda) che specifica quale campo estrarre dai Claims.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token); // Decodifica e verifica il token
        return claimsResolver.apply(claims);            // Applica la funzione di estrazione
    }

    /*
     * Valida il token verificando tutte le condizioni temporali e di identità:
     *
     * 1. token e userDetails non sono null
     * 2. L'username nel token corrisponde all'utente che fa la richiesta
     * 3. Il token non è scaduto ("exp")
     * 4. Il token è già attivo ("nbf")
     * 5. Il campo "iat" non è nel futuro (difesa da manomissioni)
     * 6. Il token non è più vecchio di MAX_TOKEN_AGE_HOURS (forza re-login periodico)
     *
     * Chiamato dal filtro JWT a ogni richiesta protetta.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        if (token == null || userDetails == null)
            return false;

        final String username = extractUsername(token);

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token)
                && !isTokenNotYetValid(token)
                && !isIssuedAtInFuture(token)
                && !isTokenTooOld(token);
    }

    /*
     * Controlla se il token è scaduto confrontando "exp" con l'ora attuale.
     * Restituisce true (= scaduto) anche in caso di eccezione, per sicurezza:
     * un token malformato o con firma invalida viene trattato come non valido.
     */
    private boolean isTokenExpired(String token) {
        try
        {
            return extractExpiration(token).before(new Date());
        }
        catch (Exception e)
        {
            return true; // Token non parsabile → considerato invalido
        }
    }

    /*
     * Controlla se il token non è ancora attivo secondo il claim "nbf" (Not Before).
     * Utile per token schedulati (es. email di attivazione con validità futura).
     */
    private boolean isTokenNotYetValid(String token) {
        Date notBefore = extractClaim(token, Claims::getNotBefore);
        if (notBefore == null)
            return false;
        // Il token è "non ancora valido" se nbf supera l'ora attuale
        return notBefore.getTime() > (System.currentTimeMillis());
    }

    /*
     * Controlla se il claim "iat" (issued at) è nel futuro.
     * Un "iat" anomalo indica una possibile manomissione del payload.
     */
    private boolean isIssuedAtInFuture(String token) {
        Date issuedAt = extractClaim(token, Claims::getIssuedAt);
        if (issuedAt == null)
            return false;
        // Il token è anomalo se "iat" supera l'ora attuale
        return issuedAt.getTime() > (System.currentTimeMillis());
    }

    /*
     * Controlla se il token è più vecchio di MAX_TOKEN_AGE_HOURS ore.
     * Anche se "exp" non è ancora scaduto, un token troppo vecchio viene rifiutato
     * per forzare un re-login periodico e limitare la finestra di attacco in caso
     * di furto del token.
     * Se "iat" non è presente, il token viene rifiutato per sicurezza.
     */
    private boolean isTokenTooOld(String token) {
        Date issuedAt = extractClaim(token, Claims::getIssuedAt);
        if (issuedAt == null)
            return true;
        long maxAgeMillis = (long) MAX_TOKEN_AGE_HOURS * 60 * 60 * 1000;
        return (System.currentTimeMillis() - issuedAt.getTime()) > maxAgeMillis;
    }

    /*
     * Estrae la data di scadenza ("exp") dal token.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /*
     * Decodifica il token e ne verifica la firma crittografica.
     * Se la firma non è valida (token manomesso o secret sbagliato),
     * la libreria JJWT lancia un'eccezione — il token viene rifiutato.
     * Restituisce il corpo (payload) come oggetto Claims.
     *
     * Nota: parseClaimsJws() (con la "s" finale) accetta SOLO token firmati.
     * Non usare parseClaimsJwt() che accetterebbe anche token senza firma (alg:none).
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey()) // Imposta la chiave per la verifica della firma
                .build()
                .parseClaimsJws(token)       // Parsifica e verifica firma — rifiuta alg:none
                .getBody();                  // Restituisce solo il payload
    }

    /*
     * Converte il SECRET (stringa codificata in Base64) in un oggetto Key
     * compatibile con HMAC-SHA256.
     *
     * Il SECRET deve essere lungo almeno 256 bit (32 byte) per l'algoritmo HS256.
     * La stringa in application.properties è in formato Base64 → si decodifica
     * prima di costruire la chiave con Keys.hmacShaKeyFor().
     */
    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET); // Decodifica Base64 → array di byte
        return Keys.hmacShaKeyFor(keyBytes);               // Crea la chiave HMAC da quei byte
    }
}
