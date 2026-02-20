package com.pingboard.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@Table(name = "health_checks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "monitor_id", nullable = false)
    private Long monitorId;

    @Column(name = "status_code")
    private Integer statusCode;

    @Column(name = "response_time_ms", nullable = false)
    private Integer responseTimeMs;

    @Column(name = "is_up", nullable = false)
    private Boolean isUp;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "checked_at", nullable = false)
    private OffsetDateTime checkedAt;

    @PrePersist
    protected void onCreate() {
        if (checkedAt == null) {
            checkedAt = OffsetDateTime.now();
        }
    }
}
