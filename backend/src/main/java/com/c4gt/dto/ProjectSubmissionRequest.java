package com.c4gt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectSubmissionRequest {
    @NotBlank(message = "Stage ID is required")
    private String stageId;

    @Size(max = 50000, message = "Code content must be under 50,000 characters")
    private String codeContent;

    @Size(max = 2000, message = "Notes must be under 2,000 characters")
    private String notes;
}
