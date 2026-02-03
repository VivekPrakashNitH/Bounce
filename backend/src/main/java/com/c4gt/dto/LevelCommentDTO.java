package com.c4gt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LevelCommentDTO {
    private Long id;
    private String content;
    private String levelId;
    private String author;
    private String authorEmail;
    private String authorAvatar;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
