package com.generation.voices.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.generation.voices.dto.PortalUserDTO;
import com.generation.voices.model.PortalUser;

@Mapper(componentModel = "spring")
public interface PortalUserMapper {

    PortalUserDTO toDTO(PortalUser portalUser);
    List<PortalUserDTO> toDTOs(List<PortalUser> portalUsers);

    PortalUser toEntity(PortalUserDTO portalUserDTO);
    List<PortalUser> toEntities(List<PortalUserDTO> portalUserDTOs);

}
