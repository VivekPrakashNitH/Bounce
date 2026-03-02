package com.c4gt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "page_time_tracking", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "page_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageTimeTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "page_id", nullable = false, length = 100)
    private String pageId;

    @Column(name = "active_time_ms", nullable = false)
    private long activeTimeMs = 0;

    @Column(name = "total_time_ms", nullable = false)
    private long totalTimeMs = 0;

    @Column(name = "tab_switches", nullable = false)
    private int tabSwitches = 0;

    @Column(name = "visit_count", nullable = false)
    private int visitCount = 1;

    @Column(name = "last_visited_at", nullable = false)
    private LocalDateTime lastVisitedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        lastVisitedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
