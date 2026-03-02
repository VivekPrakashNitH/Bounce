package com.c4gt.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RetryRequest {
    @NotBlank
    private String pageId;
    private String sectionId;
    private String quizId;
    @Min(1)
    private int attemptNumber;
    private String previousResult;
}
