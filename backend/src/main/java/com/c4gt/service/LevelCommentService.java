package com.c4gt.service;

import com.c4gt.dto.CreateLevelCommentRequest;
import com.c4gt.dto.LevelCommentDTO;
import com.c4gt.entity.LevelComment;
import com.c4gt.entity.User;
import com.c4gt.repository.LevelCommentRepository;
import com.c4gt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LevelCommentService {
    
    @Autowired
    private LevelCommentRepository levelCommentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<LevelCommentDTO> getCommentsByLevelId(String levelId) {
        return levelCommentRepository.findByLevelIdOrderByCreatedAtAsc(levelId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public LevelCommentDTO createComment(CreateLevelCommentRequest request) {
        LevelComment comment = new LevelComment();
        comment.setContent(request.getContent());
        comment.setLevelId(request.getLevelId());
        comment.setAuthor(request.getAuthor());
        comment.setAuthorEmail(request.getAuthorEmail());
        comment.setAuthorAvatar(request.getAuthorAvatar());
        
        // Try to link to user if email matches
        if (request.getAuthorEmail() != null && !request.getAuthorEmail().isEmpty()) {
            userRepository.findByEmail(request.getAuthorEmail())
                    .ifPresent(comment::setUser);
        }
        
        LevelComment saved = levelCommentRepository.save(comment);
        return convertToDTO(saved);
    }
    
    public void deleteComment(Long id) {
        if (!levelCommentRepository.existsById(id)) {
            throw new RuntimeException("Comment not found with id: " + id);
        }
        levelCommentRepository.deleteById(id);
    }
    
    private LevelCommentDTO convertToDTO(LevelComment comment) {
        LevelCommentDTO dto = new LevelCommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setLevelId(comment.getLevelId());
        dto.setAuthor(comment.getAuthor());
        dto.setAuthorEmail(comment.getAuthorEmail());
        dto.setAuthorAvatar(comment.getAuthorAvatar());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
}
