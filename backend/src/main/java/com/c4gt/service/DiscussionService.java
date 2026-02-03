package com.c4gt.service;

import com.c4gt.dto.*;
import com.c4gt.entity.Discussion;
import com.c4gt.entity.Comment;
import com.c4gt.repository.DiscussionRepository;
import com.c4gt.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DiscussionService {
    
    @Autowired
    private DiscussionRepository discussionRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    public List<DiscussionDTO> getAllDiscussions() {
        return discussionRepository.findByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public DiscussionDTO getDiscussionById(Long id) {
        Discussion discussion = discussionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discussion not found with id: " + id));
        return convertToDTO(discussion);
    }
    
    public DiscussionDTO createDiscussion(CreateDiscussionRequest request) {
        Discussion discussion = new Discussion();
        discussion.setTitle(request.getTitle());
        discussion.setContent(request.getContent());
        discussion.setAuthor(request.getAuthor());
        
        Discussion saved = discussionRepository.save(discussion);
        return convertToDTO(saved);
    }
    
    public CommentDTO addComment(CreateCommentRequest request) {
        Discussion discussion = discussionRepository.findById(request.getDiscussionId())
                .orElseThrow(() -> new RuntimeException("Discussion not found with id: " + request.getDiscussionId()));
        
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setAuthor(request.getAuthor());
        comment.setDiscussion(discussion);
        
        Comment saved = commentRepository.save(comment);
        return convertToCommentDTO(saved);
    }
    
    public List<CommentDTO> getCommentsByDiscussionId(Long discussionId) {
        return commentRepository.findByDiscussionIdOrderByCreatedAtAsc(discussionId).stream()
                .map(this::convertToCommentDTO)
                .collect(Collectors.toList());
    }
    
    public void deleteDiscussion(Long id) {
        if (!discussionRepository.existsById(id)) {
            throw new RuntimeException("Discussion not found with id: " + id);
        }
        discussionRepository.deleteById(id);
    }
    
    public void deleteComment(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new RuntimeException("Comment not found with id: " + id);
        }
        commentRepository.deleteById(id);
    }
    
    private DiscussionDTO convertToDTO(Discussion discussion) {
        DiscussionDTO dto = new DiscussionDTO();
        dto.setId(discussion.getId());
        dto.setTitle(discussion.getTitle());
        dto.setContent(discussion.getContent());
        dto.setAuthor(discussion.getAuthor());
        dto.setCreatedAt(discussion.getCreatedAt());
        dto.setUpdatedAt(discussion.getUpdatedAt());
        dto.setCommentCount(discussion.getComments() != null ? discussion.getComments().size() : 0);
        
        if (discussion.getComments() != null) {
            dto.setComments(discussion.getComments().stream()
                    .map(this::convertToCommentDTO)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    private CommentDTO convertToCommentDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setAuthor(comment.getAuthor());
        dto.setDiscussionId(comment.getDiscussion().getId());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
}
