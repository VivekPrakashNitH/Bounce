package com.c4gt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class DiscussionBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(DiscussionBackendApplication.class, args);
    }
}
