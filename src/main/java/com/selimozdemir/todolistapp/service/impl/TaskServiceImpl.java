package com.selimozdemir.todolistapp.service.impl;

import com.selimozdemir.todolistapp.domain.enumeration.Status;
import com.selimozdemir.todolistapp.service.TaskService;
import com.selimozdemir.todolistapp.domain.Task;
import com.selimozdemir.todolistapp.repository.TaskRepository;
import com.selimozdemir.todolistapp.repository.search.TaskSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.*;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing Task.
 */
@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final Logger log = LoggerFactory.getLogger(TaskServiceImpl.class);

    private TaskRepository taskRepository;

    private TaskSearchRepository taskSearchRepository;

    private EntityManager em;

    public TaskServiceImpl(TaskRepository taskRepository, TaskSearchRepository taskSearchRepository, EntityManager em) {
        this.taskRepository = taskRepository;
        this.taskSearchRepository = taskSearchRepository;
        this.em = em;
    }

    /**
     * Save a task.
     *
     * @param task the entity to save
     * @return the persisted entity
     */
    @Override
    public Task save(Task task) {
        log.debug("Request to save Task : {}", task);
        Task result = taskRepository.save(task);
        taskSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the tasks.
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Task> findAll(Pageable pageable) {
        log.debug("Request to get all Tasks");
        return taskRepository.findAll(pageable);
    }


    /**
     * Get one task by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Task> findOne(Long id) {
        log.debug("Request to get Task : {}", id);
        return taskRepository.findById(id);
    }

    /**
     * Delete the task by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Task : {}", id);
        taskRepository.deleteById(id);
        taskSearchRepository.deleteById(id);
    }

    /**
     * Search for the task corresponding to the query.
     *
     * @param query the query of the search
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Task> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Tasks for query {}", query);
        return taskSearchRepository.search(queryStringQuery(query), pageable);    }

    @Override
    public Boolean completeTask(Long id) {



        Optional<Task> task = findOne(id);
        if(task.isPresent()){
            Task head = task.get();
            if(head.getStatus() == Status.INPROGRESS && head.getParents().isEmpty()) {
                return true;
            } else {
                return accept(head);
            }

        }

        return false;
    }


    public Boolean accept(Task item) {
        if(item.getStatus() == Status.INPROGRESS && item.getParents().isEmpty()) {
            return false;
        } else if (item.getStatus() == Status.INPROGRESS){
            Boolean result = true;
            for (Task i : item.getParents()) {
                result = this.accept(i);
            }

            return result;
        }

        return true;
    }

}
