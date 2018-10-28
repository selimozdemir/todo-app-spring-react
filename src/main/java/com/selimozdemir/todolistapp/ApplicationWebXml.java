package com.selimozdemir.todolistapp;

import com.selimozdemir.todolistapp.config.DefaultProfileUtil;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;


public class ApplicationWebXml extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {

        DefaultProfileUtil.addDefaultProfile(application.application());
        return application.sources(TodoListApp.class);
    }
}
