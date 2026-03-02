package com.c4gt.service;

import com.c4gt.dto.ProjectStageDTO;
import com.c4gt.dto.ProjectSubmissionRequest;
import com.c4gt.dto.UserProjectDTO;
import com.c4gt.entity.ProjectStage;
import com.c4gt.entity.ProjectSubmission;
import com.c4gt.entity.User;
import com.c4gt.entity.UserProject;
import com.c4gt.repository.ProjectStageRepository;
import com.c4gt.repository.ProjectSubmissionRepository;
import com.c4gt.repository.UserProjectRepository;
import com.c4gt.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {

    private static final Logger log = LoggerFactory.getLogger(ProjectService.class);

    // Valid stage IDs matching the frontend curriculum
    private static final List<String> VALID_STAGES = Arrays.asList(
            "monolith", "structured", "db-backed", "auth-secured",
            "cached", "dockerized", "ci-cd", "scaled", "observable");

    @Autowired
    private UserProjectRepository projectRepository;

    @Autowired
    private ProjectStageRepository stageRepository;

    @Autowired
    private ProjectSubmissionRepository submissionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Initialize a new project for the user. Idempotent — returns existing project
     * if one exists.
     */
    public UserProjectDTO initProject(Long userId) {
        // Idempotent: return existing project
        return projectRepository.findByUserIdAndDeletedFalse(userId)
                .map(this::toDTO)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    UserProject project = new UserProject();
                    project.setUser(user);
                    project.setCurrentStage("monolith");
                    project.setProjectName("My Backend Project");
                    project = projectRepository.save(project);

                    // Initialize first stage as in_progress
                    ProjectStage firstStage = new ProjectStage();
                    firstStage.setProject(project);
                    firstStage.setStageId("monolith");
                    firstStage.setStatus("in_progress");
                    firstStage.setStartedAt(LocalDateTime.now());
                    stageRepository.save(firstStage);

                    log.info("Initialized project for user {}", userId);
                    return toDTO(project);
                });
    }

    /**
     * Get the current user's project.
     */
    @Transactional(readOnly = true)
    public UserProjectDTO getMyProject(Long userId) {
        UserProject project = projectRepository.findByUserIdAndDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("No project found. Call POST /api/v1/projects/init first."));
        return toDTO(project);
    }

    /**
     * Advance to the next stage. Validates the transition is valid.
     */
    public UserProjectDTO advanceStage(Long userId, String targetStageId) {
        if (!VALID_STAGES.contains(targetStageId)) {
            throw new IllegalArgumentException("Invalid stage: " + targetStageId);
        }

        UserProject project = projectRepository.findByUserIdAndDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("No project found"));

        int currentIndex = VALID_STAGES.indexOf(project.getCurrentStage());
        int targetIndex = VALID_STAGES.indexOf(targetStageId);

        if (targetIndex > currentIndex + 1) {
            throw new IllegalArgumentException("Cannot skip stages. Current: " + project.getCurrentStage());
        }

        // Mark current stage as completed
        stageRepository.findByProjectIdAndStageId(project.getId(), project.getCurrentStage())
                .ifPresent(stage -> {
                    stage.setStatus("completed");
                    stage.setCompletedAt(LocalDateTime.now());
                    stageRepository.save(stage);
                });

        // Create or update target stage
        ProjectStage nextStage = stageRepository
                .findByProjectIdAndStageId(project.getId(), targetStageId)
                .orElseGet(() -> {
                    ProjectStage s = new ProjectStage();
                    s.setProject(project);
                    s.setStageId(targetStageId);
                    return s;
                });
        nextStage.setStatus("in_progress");
        nextStage.setStartedAt(LocalDateTime.now());
        stageRepository.save(nextStage);

        project.setCurrentStage(targetStageId);
        projectRepository.save(project);

        log.info("User {} advanced to stage {}", userId, targetStageId);
        return toDTO(project);
    }

    /**
     * Submit code for a stage.
     */
    public void submitCode(Long userId, ProjectSubmissionRequest request) {
        if (!VALID_STAGES.contains(request.getStageId())) {
            throw new IllegalArgumentException("Invalid stage: " + request.getStageId());
        }

        UserProject project = projectRepository.findByUserIdAndDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("No project found"));

        int attemptNumber = submissionRepository.countByProjectIdAndStageId(
                project.getId(), request.getStageId()) + 1;

        ProjectSubmission submission = new ProjectSubmission();
        submission.setProject(project);
        submission.setStageId(request.getStageId());
        submission.setCodeContent(request.getCodeContent());
        submission.setNotes(request.getNotes());
        submission.setAttemptNumber(attemptNumber);
        submissionRepository.save(submission);

        log.info("User {} submitted code for stage {} (attempt #{})", userId, request.getStageId(), attemptNumber);
    }

    private UserProjectDTO toDTO(UserProject project) {
        List<ProjectStageDTO> stages = stageRepository
                .findByProjectIdOrderByCreatedAtAsc(project.getId())
                .stream()
                .map(s -> new ProjectStageDTO(s.getStageId(), s.getStatus(), s.getStartedAt(), s.getCompletedAt()))
                .collect(Collectors.toList());

        UserProjectDTO dto = new UserProjectDTO();
        dto.setId(project.getId());
        dto.setCurrentStage(project.getCurrentStage());
        dto.setProjectName(project.getProjectName());
        dto.setStartedAt(project.getStartedAt());
        dto.setLastActiveAt(project.getLastActiveAt());
        dto.setStages(stages);
        return dto;
    }
}
