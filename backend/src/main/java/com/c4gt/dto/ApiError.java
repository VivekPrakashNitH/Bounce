package com.c4gt.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Standardized error response.
 * Every error from the API follows this structure for consistent client-side
 * parsing.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {
    private int status;
    private String code;
    private String message;
    private String details;
    private String timestamp;

    public ApiError(int status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
        this.timestamp = Instant.now().toString();
    }

    public ApiError(int status, String code, String message, String details) {
        this(status, code, message);
        this.details = details;
    }
}
