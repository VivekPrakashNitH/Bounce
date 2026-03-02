package com.c4gt.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI 3.0 configuration for auto-generated API documentation.
 * Accessible at /swagger-ui.html or /v3/api-docs.
 *
 * Note: Requires springdoc-openapi-starter-webmvc-ui dependency in pom.xml.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("BeCurious API")
                        .description(
                                "Learning platform API — authentication, engagement tracking, progress, analytics, and GDPR data management")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("BeCurious Team")
                                .url("https://github.com/VivekPrakashNitH/BeCurious"))
                        .license(new License()
                                .name("MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local"),
                        new Server().url("https://becurious.onrender.com").description("Production")));
    }
}
