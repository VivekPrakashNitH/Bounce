package com.c4gt.controller;

import com.c4gt.service.UserDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * GDPR user data endpoints.
 * All endpoints require authentication — users can only access their own data.
 */
@RestController
@RequestMapping("/api/v1/user/data")
public class UserDataController {

    @Autowired
    private UserDataService userDataService;

    /**
     * Export all user data (GDPR Article 15 — Right of Access).
     */
    @GetMapping("/export")
    public ResponseEntity<?> exportData(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(userDataService.exportUserData(userId));
    }

    /**
     * Delete all user data (GDPR Article 17 — Right to Erasure).
     * Requires explicit confirmation via request body.
     */
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteData(
            Authentication auth,
            @RequestBody Map<String, Object> body,
            HttpServletRequest request) {
        Long userId = (Long) auth.getPrincipal();

        // Require explicit confirmation
        Boolean confirmed = (Boolean) body.get("confirmed");
        if (!Boolean.TRUE.equals(confirmed)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Must include {\"confirmed\": true} to delete data"));
        }

        Map<String, Object> result = userDataService.deleteUserData(userId, request.getRemoteAddr());
        return ResponseEntity.ok(result);
    }
}
