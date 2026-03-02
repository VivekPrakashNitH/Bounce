package com.c4gt.repository;

import com.c4gt.entity.ProjectStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectStageRepository extends JpaRepository<ProjectStage, Long> {
    List<ProjectStage> findByProjectIdOrderByCreatedAtAsc(Long projectId);

    Optional<ProjectStage> findByProjectIdAndStageId(Long projectId, String stageId);
}
