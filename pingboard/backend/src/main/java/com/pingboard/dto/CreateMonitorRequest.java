package com.pingboard.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateMonitorRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be at most 100 characters")
    private String name;

    @NotBlank(message = "URL is required")
    @Size(max = 2048, message = "URL must be at most 2048 characters")
    @Pattern(regexp = "^https?://.*", message = "URL must start with http:// or https://")
    private String url;

    @Pattern(regexp = "^(GET|HEAD|POST|PUT|DELETE)$", message = "Method must be GET, HEAD, POST, PUT, or DELETE")
    private String method = "GET";

    @Min(value = 30, message = "Interval must be at least 30 seconds")
    @Max(value = 3600, message = "Interval must be at most 3600 seconds")
    private Integer intervalSeconds = 60;

    @Min(value = 1000, message = "Timeout must be at least 1000ms")
    @Max(value = 30000, message = "Timeout must be at most 30000ms")
    private Integer timeoutMs = 10000;

    @Min(value = 100, message = "Expected status must be between 100 and 599")
    @Max(value = 599, message = "Expected status must be between 100 and 599")
    private Integer expectedStatus = 200;
}
