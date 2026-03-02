package com.c4gt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProjectDTO {
    private Long id;
    private String currentStage;
    private String projectName;
    private LocalDateTime startedAt;
    private LocalDateTime lastActiveAt;
    private List<ProjectStageDTO> stages;
}
