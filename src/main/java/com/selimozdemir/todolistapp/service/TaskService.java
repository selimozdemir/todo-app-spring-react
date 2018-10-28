package com.selimozdemir.todolistapp.service;

import com.selimozdemir.todolistapp.domain.Task;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;


public interface TaskService {


    Task save(Task task);


    Page<Task> findAll(Pageable pageable);



    Optional<Task> findOne(Long id);


    void delete(Long id);


    Page<Task> search(String query, Pageable pageable);

    Boolean completeTask(Long id);
}
