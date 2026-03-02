package com.c4gt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EngagementSummaryDTO {
    private int totalPagesVisited;
    private long totalActiveTimeMs;
    private int averageScrollDepth;
    private int dropoffCount;
    private int retryCount;
}
