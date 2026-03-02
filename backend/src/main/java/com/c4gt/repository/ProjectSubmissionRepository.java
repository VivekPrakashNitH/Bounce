package com.c4gt.repository;

import com.c4gt.entity.ProjectSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectSubmissionRepository extends JpaRepository<ProjectSubmission, Long> {
    List<ProjectSubmission> findByProjectIdAndStageIdOrderByAttemptNumberDesc(Long projectId, String stageId);

    int countByProjectIdAndStageId(Long projectId, String stageId);
}
