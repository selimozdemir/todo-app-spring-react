package com.selimozdemir.todolistapp.domain;

import com.selimozdemir.todolistapp.domain.enumeration.Status;
import java.time.Instant;
import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Task.class)
public abstract class Task_ {

	public static volatile SingularAttribute<Task, Task> task;
	public static volatile SingularAttribute<Task, String> name;
	public static volatile SingularAttribute<Task, String> description;
	public static volatile SingularAttribute<Task, Long> id;
	public static volatile SingularAttribute<Task, Instant> deadline;
	public static volatile SingularAttribute<Task, User> user;
	public static volatile SingularAttribute<Task, Instant> createDate;
	public static volatile SingularAttribute<Task, Status> status;
	public static volatile SetAttribute<Task, Task> parents;

}

