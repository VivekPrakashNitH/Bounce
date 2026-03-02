package com.c4gt.controller;

import com.c4gt.service.MasteryService;
import com.c4gt.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Learning path and mastery endpoints.
 */
@RestController
@RequestMapping("/api/v1")
public class LearningController {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private MasteryService masteryService;

    @GetMapping("/recommendations/next")
    public ResponseEntity<?> getNextRecommendation(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(recommendationService.getNextRecommendation(userId));
    }

    @GetMapping("/mastery/{conceptId}")
    public ResponseEntity<?> getMastery(Authentication auth, @PathVariable String conceptId) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(masteryService.getMastery(userId, conceptId));
    }
}
