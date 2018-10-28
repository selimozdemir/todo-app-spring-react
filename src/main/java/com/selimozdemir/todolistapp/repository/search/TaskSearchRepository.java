package com.selimozdemir.todolistapp.repository.search;

import com.selimozdemir.todolistapp.domain.Task;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


public interface TaskSearchRepository extends ElasticsearchRepository<Task, Long> {
}
