package com.generation.voices.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.generation.voices.model.PortalUser;

public interface PortalUserRepository extends JpaRepository<PortalUser, Integer> {

}
