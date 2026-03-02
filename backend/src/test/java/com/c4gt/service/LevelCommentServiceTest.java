package com.c4gt.service;

import com.c4gt.dto.CreateLevelCommentRequest;
import com.c4gt.dto.LevelCommentDTO;
import com.c4gt.entity.LevelComment;
import com.c4gt.repository.LevelCommentRepository;
import com.c4gt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for LevelCommentService.
 * Uses Mockito to mock repositories — no database required.
 */
@ExtendWith(MockitoExtension.class)
class LevelCommentServiceTest {

    @Mock
    private LevelCommentRepository levelCommentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LevelCommentService levelCommentService;

    private LevelComment sampleComment;

    @BeforeEach
    void setUp() {
        sampleComment = new LevelComment();
        sampleComment.setId(1L);
        sampleComment.setContent("Great explanation!");
        sampleComment.setLevelId("LEVEL_CLIENT_SERVER");
        sampleComment.setAuthor("Alice");
        sampleComment.setAuthorEmail("alice@example.com");
        sampleComment.setCreatedAt(LocalDateTime.now());
        sampleComment.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    @DisplayName("getCommentsByLevelId returns DTOs for existing level")
    void getCommentsByLevelId_returnsComments() {
        when(levelCommentRepository.findByLevelIdOrderByCreatedAtAsc("LEVEL_CLIENT_SERVER"))
                .thenReturn(Arrays.asList(sampleComment));

        List<LevelCommentDTO> result = levelCommentService.getCommentsByLevelId("LEVEL_CLIENT_SERVER");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getContent()).isEqualTo("Great explanation!");
        assertThat(result.get(0).getAuthor()).isEqualTo("Alice");
        verify(levelCommentRepository).findByLevelIdOrderByCreatedAtAsc("LEVEL_CLIENT_SERVER");
    }

    @Test
    @DisplayName("getCommentsByLevelId returns empty list for unknown level")
    void getCommentsByLevelId_emptyForUnknownLevel() {
        when(levelCommentRepository.findByLevelIdOrderByCreatedAtAsc("NONEXISTENT"))
                .thenReturn(List.of());

        List<LevelCommentDTO> result = levelCommentService.getCommentsByLevelId("NONEXISTENT");

        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("createComment saves and returns DTO")
    void createComment_savesAndReturnsDTO() {
        CreateLevelCommentRequest request = new CreateLevelCommentRequest();
        request.setContent("Nice demo!");
        request.setLevelId("LEVEL_LOAD_BALANCER");
        request.setAuthor("Bob");
        request.setAuthorEmail("bob@example.com");

        when(userRepository.findByEmail("bob@example.com")).thenReturn(Optional.empty());
        when(levelCommentRepository.save(any(LevelComment.class))).thenAnswer(invocation -> {
            LevelComment saved = invocation.getArgument(0);
            saved.setId(2L);
            saved.setCreatedAt(LocalDateTime.now());
            saved.setUpdatedAt(LocalDateTime.now());
            return saved;
        });

        LevelCommentDTO result = levelCommentService.createComment(request);

        assertThat(result.getId()).isEqualTo(2L);
        assertThat(result.getContent()).isEqualTo("Nice demo!");
        assertThat(result.getLevelId()).isEqualTo("LEVEL_LOAD_BALANCER");
        verify(levelCommentRepository).save(any(LevelComment.class));
    }

    @Test
    @DisplayName("deleteComment throws for nonexistent id")
    void deleteComment_throwsForNonexistentId() {
        when(levelCommentRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> levelCommentService.deleteComment(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Comment not found");

        verify(levelCommentRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("deleteComment deletes existing comment")
    void deleteComment_deletesExisting() {
        when(levelCommentRepository.existsById(1L)).thenReturn(true);

        levelCommentService.deleteComment(1L);

        verify(levelCommentRepository).deleteById(1L);
    }
}
