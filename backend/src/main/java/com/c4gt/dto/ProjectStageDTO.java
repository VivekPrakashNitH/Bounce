package com.c4gt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectStageDTO {
    private String stageId;
    private String status; // locked, in_progress, completed
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
