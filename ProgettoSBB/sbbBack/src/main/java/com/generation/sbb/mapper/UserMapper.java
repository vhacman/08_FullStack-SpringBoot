package com.generation.sbb.mapper;

import com.generation.sbb.dto.UserDTO;
import com.generation.sbb.model.User;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses={HotelMapper.class})
public interface UserMapper {

    UserDTO toDTO(User user);
   
    List<UserDTO> toDTOs(List<User> users);

    User toEntity(UserDTO userDTO);
    List<User> toEntities(List<UserDTO> userDTOs);
}