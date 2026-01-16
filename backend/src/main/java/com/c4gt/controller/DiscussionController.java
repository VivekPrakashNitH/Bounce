package com.c4gt.controller;

import com.c4gt.dto.*;
import com.c4gt.service.DiscussionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discussions")
@CrossOrigin(origins = "*")
public class DiscussionController {
    
    @Autowired
    private DiscussionService discussionService;
    
    @GetMapping
    public ResponseEntity<List<DiscussionDTO>> getAllDiscussions() {
        List<DiscussionDTO> discussions = discussionService.getAllDiscussions();
        return ResponseEntity.ok(discussions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DiscussionDTO> getDiscussionById(@PathVariable Long id) {
        try {
            DiscussionDTO discussion = discussionService.getDiscussionById(id);
            return ResponseEntity.ok(discussion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<DiscussionDTO> createDiscussion(@Valid @RequestBody CreateDiscussionRequest request) {
        DiscussionDTO created = discussionService.createDiscussion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscussion(@PathVariable Long id) {
        try {
            discussionService.deleteDiscussion(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long id) {
        List<CommentDTO> comments = discussionService.getCommentsByDiscussionId(id);
        return ResponseEntity.ok(comments);
    }
    
    @PostMapping("/comments")
    public ResponseEntity<CommentDTO> addComment(@Valid @RequestBody CreateCommentRequest request) {
        CommentDTO created = discussionService.addComment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        try {
            discussionService.deleteComment(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
