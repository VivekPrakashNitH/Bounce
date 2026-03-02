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
public class SectionTimeRequest {
    @NotBlank
    private String pageId;
    @NotBlank
    private String sectionId;
    @Min(0)
    private long activeTimeMs;
    @Min(0)
    @Max(100)
    private int visibilityPercent;
}
