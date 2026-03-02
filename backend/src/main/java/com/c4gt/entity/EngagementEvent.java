package com.c4gt.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "engagement_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EngagementEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "session_id", nullable = false, length = 64)
    private String sessionId;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    @Column(name = "page_id", nullable = false, length = 100)
    private String pageId;

    @Column(name = "section_id", length = 100)
    private String sectionId;

    @Column(name = "duration_ms")
    private Integer durationMs;

    @Column(name = "scroll_depth")
    private Short scrollDepth;

    @Column(columnDefinition = "JSONB")
    private String metadata;

    @Column(name = "client_version", length = 20)
    private String clientVersion;

    @Column(name = "server_ts", nullable = false)
    private LocalDateTime serverTs;

    @Column(name = "client_ts", nullable = false)
    private LocalDateTime clientTs;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        serverTs = LocalDateTime.now();
    }
}
