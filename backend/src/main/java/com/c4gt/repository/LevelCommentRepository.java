package com.c4gt.repository;

import com.c4gt.entity.LevelComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LevelCommentRepository extends JpaRepository<LevelComment, Long> {
    List<LevelComment> findByLevelIdOrderByCreatedAtAsc(String levelId);
    void deleteByLevelId(String levelId);
}
