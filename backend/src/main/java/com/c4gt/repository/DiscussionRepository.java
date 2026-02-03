package com.c4gt.repository;

import com.c4gt.entity.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    
    List<Discussion> findByOrderByCreatedAtDesc();
    
    @Query("SELECT d FROM Discussion d WHERE d.title LIKE %:keyword% OR d.content LIKE %:keyword%")
    List<Discussion> searchByKeyword(String keyword);
}
