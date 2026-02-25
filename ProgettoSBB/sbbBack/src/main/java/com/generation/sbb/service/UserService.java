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

@Service
@Validated
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordHasher passwordHasher;


    public List<UserDTO> findAll() {
        return userMapper.toDTOs(userRepository.findAll());
    }

    public UserDTO findById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return userMapper.toDTO(user);
    }

    public UserDTO save(@Valid UserDTO userDTO) {
        
        userDTO.setPassword(passwordHasher.toHash(userDTO.getPassword()));
        User user = userMapper.toEntity(userDTO);
        user = userRepository.save(user);
        return userMapper.toDTO(user);
    }

    public void deleteById(Integer id) {
        userRepository.deleteById(id);
    }

    public TokenDTO login(LoginDTO loginDTO) {
        User user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!user.getPassword().equals(passwordHasher.toHash(loginDTO.getPassword()))) {
            throw new RuntimeException("Invalid password");
        }

        // In un sistema reale qui genereresti un JWT. Per ora usiamo un UUID come token di sessione.
        return new TokenDTO(UUID.randomUUID().toString());
    }
}