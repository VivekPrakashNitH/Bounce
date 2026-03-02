package com.c4gt.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Security audit logging. Append-only — events are never updated or deleted.
 * All writes are async to avoid adding latency to auth operations.
 */
@Service
public class SecurityAuditService {

    private static final Logger log = LoggerFactory.getLogger(SecurityAuditService.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Async
    public void logEvent(String eventType, Long userId, String ipAddress, String userAgent,
            Map<String, Object> details) {
        try {
            String detailsJson = details != null
                    ? new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(details)
                    : "{}";

            jdbcTemplate.update(
                    """
                                INSERT INTO security_audit_log (user_id, event_type, ip_address, user_agent, details, created_at)
                                VALUES (?, ?, ?, ?, ?::JSONB, NOW())
                            """,
                    userId, eventType, ipAddress, userAgent, detailsJson);
        } catch (Exception e) {
            // Audit log failures must not block auth operations
            log.error("Failed to write audit log: type={}, userId={}", eventType, userId, e);
        }
    }

    // Convenience methods
    public void logLoginSuccess(Long userId, String ip, String userAgent) {
        logEvent("LOGIN_SUCCESS", userId, ip, userAgent, null);
    }

    public void logLoginFailure(String email, String ip, String userAgent) {
        logEvent("LOGIN_FAILURE", null, ip, userAgent, Map.of("email", email));
    }

    public void logLogout(Long userId, String ip) {
        logEvent("LOGOUT", userId, ip, null, null);
    }

    public void logOtpSent(Long userId, String ip) {
        logEvent("OTP_SENT", userId, ip, null, null);
    }

    public void logPasswordChange(Long userId, String ip) {
        logEvent("PASSWORD_CHANGE", userId, ip, null, null);
    }

    public void logSessionCreated(Long userId, String ip, String deviceInfo) {
        logEvent("SESSION_CREATED", userId, ip, null, Map.of("device", deviceInfo != null ? deviceInfo : "unknown"));
    }

    public void logSessionRevoked(Long userId, Long sessionId, String ip) {
        logEvent("SESSION_REVOKED", userId, ip, null, Map.of("sessionId", sessionId));
    }
}
