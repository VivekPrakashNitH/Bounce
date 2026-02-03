package com.c4gt.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Simplified comment entity specifically for game level comments
 * This is separate from Discussion comments to keep the model clean
 */
@Entity
@Table(name = "level_comments", indexes = {
    @Index(name = "idx_level_id", columnList = "levelId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LevelComment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Content is required")
    @Size(min = 1, max = 2000, message = "Comment must be between 1 and 2000 characters")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(nullable = false)
    private String levelId; // Game level identifier (e.g., "LEVEL_CLIENT_SERVER")
    
    @Column(nullable = false)
    private String author;
    
    @Column
    private String authorEmail;
    
    @Column
    private String authorAvatar;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Optional: link to authenticated user
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
