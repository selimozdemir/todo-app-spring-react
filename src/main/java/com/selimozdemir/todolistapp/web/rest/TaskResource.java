package com.selimozdemir.todolistapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.selimozdemir.todolistapp.domain.Task;
import com.selimozdemir.todolistapp.domain.User;
import com.selimozdemir.todolistapp.domain.enumeration.Status;
import com.selimozdemir.todolistapp.service.TaskService;
import com.selimozdemir.todolistapp.service.UserService;
import com.selimozdemir.todolistapp.service.dto.UserDTO;
import com.selimozdemir.todolistapp.web.rest.errors.BadRequestAlertException;
import com.selimozdemir.todolistapp.web.rest.errors.InternalServerErrorException;
import com.selimozdemir.todolistapp.web.rest.util.HeaderUtil;
import com.selimozdemir.todolistapp.web.rest.util.PaginationUtil;
import com.selimozdemir.todolistapp.service.dto.TaskCriteria;
import com.selimozdemir.todolistapp.service.TaskQueryService;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Task.
 */
@RestController
@RequestMapping("/api")
public class TaskResource {

    private final Logger log = LoggerFactory.getLogger(TaskResource.class);

    private static final String ENTITY_NAME = "task";

    private UserService userService;

    private TaskService taskService;

    private TaskQueryService taskQueryService;

    public TaskResource(UserService userService, TaskService taskService, TaskQueryService taskQueryService) {
        this.userService = userService;
        this.taskService = taskService;
        this.taskQueryService = taskQueryService;
    }

    /**
     * POST  /tasks : Create a new task.
     *
     * @param task the task to create
     * @return the ResponseEntity with status 201 (Created) and with body the new task, or with status 400 (Bad Request) if the task has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/tasks")
    @Timed
    public ResponseEntity<Task> createTask(@RequestBody Task task) throws URISyntaxException {
        log.debug("REST request to save Task : {}", task);
        if (task.getId() != null) {
            throw new BadRequestAlertException("A new task cannot already have an ID", ENTITY_NAME, "idexists");
        }

        task.setCreateDate(Instant.now());

        User user = userService.getUserWithAuthorities()
            .orElseThrow(() -> new InternalServerErrorException("User could not be found"));

        task.setUser(user);

        Task result = taskService.save(task);
        return ResponseEntity.created(new URI("/api/tasks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /tasks : Updates an existing task.
     *
     * @param task the task to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated task,
     * or with status 400 (Bad Request) if the task is not valid,
     * or with status 500 (Internal Server Error) if the task couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/tasks")
    @Timed
    public ResponseEntity<Task> updateTask(@RequestBody Task task) throws URISyntaxException {
        log.debug("REST request to update Task : {}", task);
        if (task.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        if(task.getCreateDate() == null) {
            task.setCreateDate(Instant.now());
        }

        Task result = taskService.save(task);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, task.getId().toString()))
            .body(result);
    }

    /**
     * GET  /tasks : get all the tasks.
     *
     * @param pageable the pagination information
     * @param criteria the criterias which the requested entities should match
     * @return the ResponseEntity with status 200 (OK) and the list of tasks in body
     */
    @GetMapping("/tasks")
    @Timed
    public ResponseEntity<List<Task>> getAllTasks(TaskCriteria criteria, Pageable pageable) {
        log.debug("REST request to get Tasks by criteria: {}", criteria);
        Page<Task> page = taskQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/tasks");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
    * GET  /tasks/count : count all the tasks.
    *
    * @param criteria the criterias which the requested entities should match
    * @return the ResponseEntity with status 200 (OK) and the count in body
    */
    @GetMapping("/tasks/count")
    @Timed
    public ResponseEntity<Long> countTasks(TaskCriteria criteria) {
        log.debug("REST request to count Tasks by criteria: {}", criteria);
        return ResponseEntity.ok().body(taskQueryService.countByCriteria(criteria));
    }

    /**
     * GET  /tasks/:id : get the "id" task.
     *
     * @param id the id of the task to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the task, or with status 404 (Not Found)
     */
    @GetMapping("/tasks/{id}")
    @Timed
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        log.debug("REST request to get Task : {}", id);
        Optional<Task> task = taskService.findOne(id);
        return ResponseUtil.wrapOrNotFound(task);
    }

    /**
     * DELETE  /tasks/:id : delete the "id" task.
     *
     * @param id the id of the task to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/tasks/{id}")
    @Timed
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        log.debug("REST request to delete Task : {}", id);
        taskService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/tasks/{id}/complete")
    @Timed
    public ResponseEntity<Task> completeTask(@PathVariable Long id){
        log.debug("REST request to complete Task : {}", id);

        Task task = taskService.findOne(id).orElseThrow(() -> new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull"));
        if(taskService.completeTask(id)){
            task.setStatus(Status.COMPLETED);
            taskService.save(task);
        } else {
            throw new BadRequestAlertException("This task is not yet complete with identifier", ENTITY_NAME, "idnull");
        }

        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityCompletionAlert(ENTITY_NAME,id.toString()))
            .body(task);
    }

    /**
     * SEARCH  /_search/tasks?query=:query : search for the task corresponding
     * to the query.
     *
     * @param query the query of the task search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/tasks")
    @Timed
    public ResponseEntity<List<Task>> searchTasks(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Tasks for query {}", query);
        Page<Task> page = taskService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/tasks");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
