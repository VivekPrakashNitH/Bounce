package com.c4gt.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DropoffRequest {
    @NotBlank
    private String pageId;
    private String lastSectionSeen;
    @Min(0)
    @Max(100)
    private int scrollDepthPercent;
    @Min(0)
    private int timeSpentMs;
    private String referrer;
}
