package com.pingboard.repository;

import com.pingboard.entity.HealthCheck;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface HealthCheckRepository extends JpaRepository<HealthCheck, Long> {

    List<HealthCheck> findByMonitorIdAndCheckedAtAfterOrderByCheckedAtDesc(
            Long monitorId, OffsetDateTime after);

    List<HealthCheck> findByMonitorIdOrderByCheckedAtDesc(Long monitorId, Pageable pageable);

    Optional<HealthCheck> findFirstByMonitorIdOrderByCheckedAtDesc(Long monitorId);

    @Query("SELECT COUNT(h) FROM HealthCheck h WHERE h.monitorId = :monitorId AND h.checkedAt > :since AND h.isUp = true")
    long countUpChecks(@Param("monitorId") Long monitorId, @Param("since") OffsetDateTime since);

    @Query("SELECT COUNT(h) FROM HealthCheck h WHERE h.monitorId = :monitorId AND h.checkedAt > :since")
    long countTotalChecks(@Param("monitorId") Long monitorId, @Param("since") OffsetDateTime since);

    @Query("SELECT COALESCE(AVG(h.responseTimeMs), 0) FROM HealthCheck h WHERE h.monitorId = :monitorId AND h.checkedAt > :since AND h.isUp = true")
    double averageResponseTime(@Param("monitorId") Long monitorId, @Param("since") OffsetDateTime since);
}
