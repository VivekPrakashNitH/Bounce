package com.pingboard.repository;

import com.pingboard.entity.Monitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonitorRepository extends JpaRepository<Monitor, Long> {
    List<Monitor> findByUserId(Long userId);

    List<Monitor> findByIsActiveTrue();

    Optional<Monitor> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);
}
