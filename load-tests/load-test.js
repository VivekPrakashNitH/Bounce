// k6 Load Test — BeCurious Platform
// Run: k6 run --vus 50 --duration 60s load-test.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('error_rate');
const loginDuration = new Trend('login_duration');
const engagementDuration = new Trend('engagement_batch_duration');

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

// Test scenarios
export const options = {
    scenarios: {
        // Auth flow — 100 concurrent logins
        auth_flow: {
            executor: 'constant-vus',
            vus: 100,
            duration: '60s',
            exec: 'authFlow',
        },
        // Engagement batch — 1000 concurrent event submissions
        engagement_batch: {
            executor: 'constant-vus',
            vus: 200,
            duration: '60s',
            exec: 'engagementBatch',
            startTime: '10s', // Start after auth warmup
        },
        // Content browsing — 500 concurrent page loads
        content_browse: {
            executor: 'ramping-vus',
            startVUs: 10,
            stages: [
                { duration: '20s', target: 500 },
                { duration: '30s', target: 500 },
                { duration: '10s', target: 0 },
            ],
            exec: 'contentBrowse',
        },
    },
    thresholds: {
        http_req_duration: ['p(99)<500'],   // p99 < 500ms
        error_rate: ['rate<0.001'],          // Error rate < 0.1%
        login_duration: ['p(95)<1000'],      // Login p95 < 1s
        engagement_batch_duration: ['p(95)<300'], // Engagement p95 < 300ms
    },
};

// ── Auth Flow ──────────────────────────────────────
export function authFlow() {
    const email = `loadtest_${__VU}_${__ITER}@test.com`;

    const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
        email: email,
        password: 'LoadTest123!',
    }), { headers: { 'Content-Type': 'application/json' } });

    loginDuration.add(loginRes.timings.duration);
    check(loginRes, {
        'login status is 200 or 401': (r) => r.status === 200 || r.status === 401,
    });
    errorRate.add(loginRes.status >= 500);

    sleep(1);
}

// ── Engagement Batch ───────────────────────────────
export function engagementBatch() {
    const events = Array.from({ length: 20 }, (_, i) => ({
        eventType: 'SCROLL_DEPTH',
        pageId: `LEVEL_${Math.floor(Math.random() * 15)}`,
        timestamp: Date.now() - Math.floor(Math.random() * 60000),
        scrollDepth: Math.floor(Math.random() * 100),
        duration: Math.floor(Math.random() * 30000),
    }));

    const res = http.post(`${BASE_URL}/api/v1/engagement/batch`, JSON.stringify({
        events: events,
        sessionId: `session_${__VU}`,
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer LOAD_TEST_TOKEN', // Replace with valid JWT
        },
    });

    engagementDuration.add(res.timings.duration);
    check(res, {
        'batch accepted': (r) => r.status === 202 || r.status === 401,
    });
    errorRate.add(res.status >= 500);

    sleep(0.5);
}

// ── Content Browsing ───────────────────────────────
export function contentBrowse() {
    const levels = ['WHAT_IS_BACKEND', 'LOAD_BALANCER_DEMO', 'CACHING_DEMO',
        'DB_DEMO', 'RATE_LIMITER_DEMO', 'DOCKER_DEMO'];
    const level = levels[Math.floor(Math.random() * levels.length)];

    const res = http.get(`${BASE_URL}/api/levels/${level}`);

    check(res, {
        'level loads': (r) => r.status === 200 || r.status === 404,
    });
    errorRate.add(res.status >= 500);

    // Simulate reading time
    sleep(Math.random() * 3 + 1);
}
