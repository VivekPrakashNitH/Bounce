package com.c4gt.controller;

import com.c4gt.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Session management endpoints.
 * Users can view and revoke their active sessions.
 */
@RestController
@RequestMapping("/api/v1/auth/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @GetMapping
    public ResponseEntity<?> listSessions(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(Map.of("sessions", sessionService.listSessions(userId)));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<?> revokeSession(
            Authentication auth,
            @PathVariable Long sessionId,
            HttpServletRequest request) {
        Long userId = (Long) auth.getPrincipal();
        boolean revoked = sessionService.revokeSession(userId, sessionId, request.getRemoteAddr());

        if (revoked) {
            return ResponseEntity.ok(Map.of("message", "Session revoked"));
        }
        return ResponseEntity.notFound().build();
    }
}
