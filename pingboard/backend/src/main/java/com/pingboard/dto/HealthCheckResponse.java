package com.pingboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
public class HealthCheckResponse {
    private Long id;
    private Integer statusCode;
    private Integer responseTimeMs;
    private Boolean isUp;
    private String errorMessage;
    private OffsetDateTime checkedAt;
}
