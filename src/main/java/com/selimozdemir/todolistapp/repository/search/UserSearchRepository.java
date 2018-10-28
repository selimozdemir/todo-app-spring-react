package com.selimozdemir.todolistapp.repository.search;

import com.selimozdemir.todolistapp.domain.User;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


public interface UserSearchRepository extends ElasticsearchRepository<User, Long> {
}
