package com.generation.voices.security;

import org.springframework.stereotype.Service;

@Service
public class PasswordHasher {


    public String toMD5(String password) {  
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
            md.update(password.getBytes());
            byte[] digest = md.digest();
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

}
