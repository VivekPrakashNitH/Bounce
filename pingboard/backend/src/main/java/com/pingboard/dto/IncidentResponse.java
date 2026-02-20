package com.pingboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
public class IncidentResponse {
    private Long id;
    private Long monitorId;
    private OffsetDateTime startedAt;
    private OffsetDateTime resolvedAt;
    private String cause;
    private Long durationSeconds;
}
