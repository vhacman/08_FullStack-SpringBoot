package com.generation.veziocastelmanager.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // inietto il filtro JWT che controlla il token su ogni richiesta
    @Autowired
    private JwtAuthenticationFilter         jwtAuthFilter;

    @Bean
    public SecurityFilterChain           securityFilterChain(HttpSecurity http) throws Exception
    {
        http
            .csrf(csrf -> csrf.disable())   // disabilito il csrf perché con le API REST non serve
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/vcm/api/users/login").permitAll()     // login è pubblico, non serve il token
                .anyRequest().authenticated()   // tutto il resto richiede autenticazione
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // aggiungo il mio filtro JWT prima di quello di default di Spring
        return http.build();
    }
}
