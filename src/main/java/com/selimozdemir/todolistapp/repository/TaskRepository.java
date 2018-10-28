package com.selimozdemir.todolistapp.repository;

import com.selimozdemir.todolistapp.domain.Task;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;



@SuppressWarnings("unused")
@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

}
