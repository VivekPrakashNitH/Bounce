package com.c4gt.repository;

import com.c4gt.entity.UserProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProjectRepository extends JpaRepository<UserProject, Long> {
    Optional<UserProject> findByUserIdAndDeletedFalse(Long userId);

    boolean existsByUserIdAndDeletedFalse(Long userId);
}
