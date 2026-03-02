package com.c4gt.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageTimeRequest {
    @NotBlank
    private String pageId;
    @Min(0)
    private long activeTimeMs;
    @Min(0)
    private long totalTimeMs;
    @Min(0)
    private int tabSwitches;
}
