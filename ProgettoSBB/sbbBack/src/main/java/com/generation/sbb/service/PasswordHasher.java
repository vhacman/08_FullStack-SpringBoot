package com.generation.sbb.service;

import org.springframework.stereotype.Service;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Utility per l'hashing delle password tramite MD5.
 * MD5 è scelto per semplicità didattica: in produzione si userebbe
 * BCrypt o Argon2, che includono un salt automatico e sono resistenti
 * agli attacchi a dizionario.
 */
@Service
public class PasswordHasher
{
    /**
     * Converte una password in chiaro nel suo hash MD5 esadecimale.
     * @param password testo in chiaro da hashare
     * @return stringa hex di 32 caratteri (hash MD5)
     */
    public String toHash(String password)
    {
        try
        {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(password.getBytes());
            byte[] digest = md.digest();
            StringBuilder sb = new StringBuilder();
            for (byte b : digest)
            {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        }
        catch (NoSuchAlgorithmException e)
        {
            throw new RuntimeException(e);
        }
    }
}
