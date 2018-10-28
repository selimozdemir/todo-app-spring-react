package com.selimozdemir.todolistapp.repository;

import com.selimozdemir.todolistapp.domain.Authority;

import org.springframework.data.jpa.repository.JpaRepository;


public interface AuthorityRepository extends JpaRepository<Authority, String> {
}
