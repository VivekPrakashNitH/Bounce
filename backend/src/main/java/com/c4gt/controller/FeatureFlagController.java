package com.c4gt.controller;

import com.c4gt.service.FeatureFlagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/flags")
public class FeatureFlagController {

    @Autowired
    private FeatureFlagService featureFlagService;

    @GetMapping
    public ResponseEntity<?> getFlags(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(featureFlagService.getAllFlags(userId));
    }
}
