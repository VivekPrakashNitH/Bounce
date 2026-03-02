package com.c4gt.controller;

import com.c4gt.dto.ProjectSubmissionRequest;
import com.c4gt.dto.UserProjectDTO;
import com.c4gt.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    /**
     * Initialize a new project for the authenticated user.
     * Idempotent — returns existing project if one already exists.
     */
    @PostMapping("/init")
    public ResponseEntity<UserProjectDTO> initProject(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        UserProjectDTO project = projectService.initProject(userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }

    /**
     * Get the current user's project.
     */
    @GetMapping("/me")
    public ResponseEntity<UserProjectDTO> getMyProject(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        UserProjectDTO project = projectService.getMyProject(userId);
        return ResponseEntity.ok(project);
    }

    /**
     * Advance the user to the next stage.
     */
    @PutMapping("/me/stage")
    public ResponseEntity<UserProjectDTO> advanceStage(
            Authentication auth,
            @RequestBody Map<String, String> body) {
        Long userId = (Long) auth.getPrincipal();
        String targetStage = body.get("stageId");
        if (targetStage == null || targetStage.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        UserProjectDTO project = projectService.advanceStage(userId, targetStage);
        return ResponseEntity.ok(project);
    }

    /**
     * Submit code for a project stage.
     */
    @PostMapping("/me/submit")
    public ResponseEntity<Void> submitCode(
            Authentication auth,
            @Valid @RequestBody ProjectSubmissionRequest request) {
        Long userId = (Long) auth.getPrincipal();
        projectService.submitCode(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
