package com.c4gt.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EngagementBatchRequest {
    @NotEmpty(message = "Events list cannot be empty")
    @Size(max = 50, message = "Maximum 50 events per batch")
    @Valid
    private List<EngagementEventDTO> events;

    private String sessionId;
    private String clientVersion;
}
