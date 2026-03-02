package com.c4gt.repository;

import com.c4gt.entity.PageTimeTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PageTimeTrackingRepository extends JpaRepository<PageTimeTracking, Long> {

    Optional<PageTimeTracking> findByUserIdAndPageId(Long userId, String pageId);

    @Modifying
    @Query(value = """
            INSERT INTO page_time_tracking (user_id, page_id, active_time_ms, total_time_ms, tab_switches, visit_count, last_visited_at, created_at, updated_at)
            VALUES (:userId, :pageId, :activeMs, :totalMs, :tabSwitches, 1, NOW(), NOW(), NOW())
            ON CONFLICT (user_id, page_id) DO UPDATE SET
                active_time_ms = GREATEST(page_time_tracking.active_time_ms, :activeMs),
                total_time_ms = GREATEST(page_time_tracking.total_time_ms, :totalMs),
                tab_switches = page_time_tracking.tab_switches + :tabSwitches,
                visit_count = page_time_tracking.visit_count + 1,
                last_visited_at = NOW(),
                updated_at = NOW()
            """, nativeQuery = true)
    void upsertPageTime(@Param("userId") Long userId,
            @Param("pageId") String pageId,
            @Param("activeMs") long activeMs,
            @Param("totalMs") long totalMs,
            @Param("tabSwitches") int tabSwitches);
}
