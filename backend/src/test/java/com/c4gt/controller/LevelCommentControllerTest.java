package com.c4gt.controller;

import com.c4gt.dto.CreateLevelCommentRequest;
import com.c4gt.dto.LevelCommentDTO;
import com.c4gt.security.JwtAuthFilter;
import com.c4gt.security.JwtTokenProvider;
import com.c4gt.service.LevelCommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.bean.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Web-layer integration test for LevelCommentController.
 * Uses @WebMvcTest to test HTTP request/response mapping without starting
 * the full application context.
 */
@WebMvcTest(LevelCommentController.class)
class LevelCommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LevelCommentService levelCommentService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @Test
    @DisplayName("GET /api/level-comments/{levelId} returns 200 with comments")
    @WithMockUser
    void getCommentsByLevel_returns200() throws Exception {
        LevelCommentDTO dto = new LevelCommentDTO();
        dto.setId(1L);
        dto.setContent("Hello world");
        dto.setLevelId("LEVEL_CLIENT_SERVER");
        dto.setAuthor("Alice");
        dto.setCreatedAt(LocalDateTime.now());
        dto.setUpdatedAt(LocalDateTime.now());

        when(levelCommentService.getCommentsByLevelId("LEVEL_CLIENT_SERVER"))
                .thenReturn(Arrays.asList(dto));

        mockMvc.perform(get("/api/level-comments/LEVEL_CLIENT_SERVER"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].content", is("Hello world")))
                .andExpect(jsonPath("$[0].author", is("Alice")));
    }

    @Test
    @DisplayName("GET /api/level-comments/{levelId} returns 200 with empty list for unknown level")
    @WithMockUser
    void getCommentsByLevel_emptyList() throws Exception {
        when(levelCommentService.getCommentsByLevelId("NONEXISTENT"))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/level-comments/NONEXISTENT"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("POST /api/level-comments returns 201 for valid request")
    @WithMockUser
    void createComment_returns201() throws Exception {
        CreateLevelCommentRequest request = new CreateLevelCommentRequest();
        request.setContent("Great demo!");
        request.setLevelId("LEVEL_LOAD_BALANCER");
        request.setAuthor("Bob");

        LevelCommentDTO created = new LevelCommentDTO();
        created.setId(2L);
        created.setContent("Great demo!");
        created.setLevelId("LEVEL_LOAD_BALANCER");
        created.setAuthor("Bob");
        created.setCreatedAt(LocalDateTime.now());
        created.setUpdatedAt(LocalDateTime.now());

        when(levelCommentService.createComment(any(CreateLevelCommentRequest.class)))
                .thenReturn(created);

        mockMvc.perform(post("/api/level-comments")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(2)))
                .andExpect(jsonPath("$.content", is("Great demo!")));
    }

    @Test
    @DisplayName("POST /api/level-comments returns 400 for missing required fields")
    @WithMockUser
    void createComment_returns400ForInvalidRequest() throws Exception {
        // Empty request — missing content, levelId, author
        CreateLevelCommentRequest request = new CreateLevelCommentRequest();

        mockMvc.perform(post("/api/level-comments")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("DELETE /api/level-comments/{id} returns 204 for existing comment")
    @WithMockUser
    void deleteComment_returns204() throws Exception {
        mockMvc.perform(delete("/api/level-comments/1")
                .with(csrf()))
                .andExpect(status().isNoContent());
    }
}
