package com.c4gt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCommentRequest {
    @NotBlank(message = "Content is required")
    @Size(min = 1, max = 2000)
    private String content;
    
    @NotBlank(message = "Author is required")
    private String author;
    
    @NotNull(message = "Discussion ID is required")
    private Long discussionId;
}
