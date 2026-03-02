package com.c4gt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EngagementEventDTO {
    @NotBlank
    private String eventType;
    @NotBlank
    private String pageId;
    private String sectionId;
    @NotNull
    private Long timestamp;
    private Integer duration;
    private Integer scrollDepth;
    private Map<String, Object> metadata;
}
