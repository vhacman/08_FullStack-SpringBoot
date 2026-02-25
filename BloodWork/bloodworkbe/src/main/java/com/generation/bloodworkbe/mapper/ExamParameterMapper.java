package com.generation.bloodworkbe.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.generation.bloodworkbe.dto.ExamParameterDTO;
import com.generation.bloodworkbe.model.ExamParameter;

@Mapper(componentModel = "spring")
public interface ExamParameterMapper 
{
    ExamParameterDTO toDTO(ExamParameter parameter);

    ExamParameter fromDTO(ExamParameterDTO dto);

    List<ExamParameterDTO> toDTO(List<ExamParameter> parameters);

    
}
