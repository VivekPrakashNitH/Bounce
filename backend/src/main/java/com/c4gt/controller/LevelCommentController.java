package com.c4gt.controller;

import com.c4gt.dto.CreateLevelCommentRequest;
import com.c4gt.dto.LevelCommentDTO;
import com.c4gt.service.LevelCommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/level-comments")
@CrossOrigin(origins = "*")
public class LevelCommentController {
    
    @Autowired
    private LevelCommentService levelCommentService;
    
    @GetMapping("/{levelId}")
    public ResponseEntity<List<LevelCommentDTO>> getCommentsByLevel(@PathVariable String levelId) {
        List<LevelCommentDTO> comments = levelCommentService.getCommentsByLevelId(levelId);
        return ResponseEntity.ok(comments);
    }
    
    @PostMapping
    public ResponseEntity<LevelCommentDTO> createComment(@Valid @RequestBody CreateLevelCommentRequest request) {
        LevelCommentDTO created = levelCommentService.createComment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        try {
            levelCommentService.deleteComment(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
