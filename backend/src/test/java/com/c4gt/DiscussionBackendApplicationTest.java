package com.c4gt;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Smoke test — verifies the Spring application context loads successfully.
 * Uses a test profile to avoid requiring Redis/PostgreSQL for CI.
 */
@SpringBootTest
@ActiveProfiles("test")
class DiscussionBackendApplicationTest {

    @Test
    void contextLoads() {
        // If this test passes, the Spring context is wired correctly
    }
}
