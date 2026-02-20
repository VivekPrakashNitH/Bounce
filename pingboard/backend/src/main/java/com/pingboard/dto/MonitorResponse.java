package com.pingboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
public class MonitorResponse {
    private Long id;
    private String name;
    private String url;
    private String method;
    private Integer intervalSeconds;
    private Integer timeoutMs;
    private Integer expectedStatus;
    private Boolean isActive;
    private Boolean currentlyUp;
    private Double uptimePercent;
    private Double avgResponseMs;
    private OffsetDateTime lastCheckedAt;
    private OffsetDateTime createdAt;
}
