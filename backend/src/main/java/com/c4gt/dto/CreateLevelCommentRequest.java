package com.c4gt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateLevelCommentRequest {
    @NotBlank(message = "Content is required")
    @Size(min = 1, max = 2000, message = "Comment must be between 1 and 2000 characters")
    private String content;
    
    @NotBlank(message = "Level ID is required")
    private String levelId;
    
    @NotBlank(message = "Author name is required")
    private String author;
    
    private String authorEmail;
    private String authorAvatar;
}
