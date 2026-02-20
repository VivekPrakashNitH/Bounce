package com.pingboard.repository;

import com.pingboard.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByMonitorIdOrderByStartedAtDesc(Long monitorId);

    Optional<Incident> findByMonitorIdAndResolvedAtIsNull(Long monitorId);
}
