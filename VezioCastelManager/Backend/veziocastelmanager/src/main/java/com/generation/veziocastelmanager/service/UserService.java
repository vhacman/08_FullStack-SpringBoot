package com.generation.veziocastelmanager.service;

import com.generation.veziocastelmanager.dto.LoginDTO;
import com.generation.veziocastelmanager.dto.TokenDTO;
import com.generation.veziocastelmanager.dto.UserDTO;
import com.generation.veziocastelmanager.mapper.UserMapper;
import com.generation.veziocastelmanager.model.entities.User;
import com.generation.veziocastelmanager.repository.UserRepository;
import com.generation.veziocastelmanager.security.JwtService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService
{
    @Autowired
    private UserRepository  userRepository;

    @Autowired
    private UserMapper      userMapper;

    @Autowired
    private PasswordHasher  passwordHasher;

    @Autowired
    private JwtService      jwtService;

    public List<UserDTO> findAll()
    {
        return userMapper.toDTOs(userRepository.findAll());
    }

    public UserDTO findById(int id)
    {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        return userMapper.toDTO(user);
    }

    public UserDTO save(UserDTO userDTO)
    {
        userDTO.setPassword(passwordHasher.toHash(userDTO.getPassword()));
        User user = userMapper.toEntity(userDTO);
        user      = userRepository.save(user);
        return userMapper.toDTO(user);
    }

    public void deleteById(int id)
    {
        userRepository.deleteById(id);
    }

    public TokenDTO login(LoginDTO loginDTO)
    {
        User user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        if (!user.getPassword().equals(passwordHasher.toHash(loginDTO.getPassword())))
            throw new RuntimeException("Invalid password");
        return new TokenDTO(jwtService.generateToken(user));
    }
}
