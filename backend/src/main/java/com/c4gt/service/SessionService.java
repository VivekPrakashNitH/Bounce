package com.c4gt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Session management: tracks active sessions, limits to 3 per user,
 * and provides remote logout capability.
 */
@Service
public class SessionService {

    private static final int MAX_SESSIONS = 3;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SecurityAuditService auditService;

    /**
     * Create a new session. Revokes oldest if max exceeded.
     * 
     * @return session token
     */
    @Transactional
    public String createSession(Long userId, String ipAddress, String deviceInfo, long expiresInMs) {
        String sessionToken = UUID.randomUUID().toString();

        // Count active sessions
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM user_sessions WHERE user_id = ? AND revoked = false AND expires_at > NOW()",
                Integer.class, userId);

        // Revoke oldest sessions if at limit
        if (count != null && count >= MAX_SESSIONS) {
            jdbcTemplate.update("""
                        UPDATE user_sessions SET revoked = true
                        WHERE id IN (
                            SELECT id FROM user_sessions
                            WHERE user_id = ? AND revoked = false
                            ORDER BY created_at ASC
                            LIMIT ?
                        )
                    """, userId, count - MAX_SESSIONS + 1);
        }

        jdbcTemplate.update("""
                    INSERT INTO user_sessions (user_id, session_token, device_info, ip_address, expires_at, created_at)
                    VALUES (?, ?, ?, ?, NOW() + INTERVAL '? milliseconds', NOW())
                """.replace("? milliseconds", expiresInMs + " milliseconds"),
                userId, sessionToken, deviceInfo, ipAddress);

        auditService.logSessionCreated(userId, ipAddress, deviceInfo);
        return sessionToken;
    }

    /**
     * List active sessions for a user.
     */
    public List<Map<String, Object>> listSessions(Long userId) {
        return jdbcTemplate.queryForList("""
                    SELECT id, device_info, ip_address, last_active_at, created_at
                    FROM user_sessions
                    WHERE user_id = ? AND revoked = false AND expires_at > NOW()
                    ORDER BY last_active_at DESC
                """, userId);
    }

    /**
     * Revoke a specific session (remote logout).
     */
    @Transactional
    public boolean revokeSession(Long userId, Long sessionId, String ipAddress) {
        int updated = jdbcTemplate.update(
                "UPDATE user_sessions SET revoked = true WHERE id = ? AND user_id = ?",
                sessionId, userId);

        if (updated > 0) {
            auditService.logSessionRevoked(userId, sessionId, ipAddress);
            return true;
        }
        return false;
    }

    /**
     * Revoke all sessions for a user (e.g., password change).
     */
    @Transactional
    public void revokeAllSessions(Long userId) {
        jdbcTemplate.update(
                "UPDATE user_sessions SET revoked = true WHERE user_id = ? AND revoked = false",
                userId);
    }

    /**
     * Update last active time for a session.
     */
    public void touch(String sessionToken) {
        jdbcTemplate.update(
                "UPDATE user_sessions SET last_active_at = NOW() WHERE session_token = ? AND revoked = false",
                sessionToken);
    }
}
