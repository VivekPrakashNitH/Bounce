/**
 * Level-to-Stage mapping file.
 * 
 * Maps every GameState level to (a) a project stage ID and (b) a specific implementation task.
 * Levels without a mapping (projectTask: null) are non-project content (gaming, some case studies).
 * 
 * This data is consumed by the ApplyThis component to show contextual project tasks after each demo.
 */

import { GameState } from '../types';

export interface LevelProjectTask {
    stageId: string;
    task: string;
    hint?: string;
}

export const LEVEL_PROJECT_TASKS: Partial<Record<GameState, LevelProjectTask>> = {
    // --- Stage 1: Monolith ---
    [GameState.LEVEL_BACKEND_LANGUAGES]: {
        stageId: 'monolith',
        task: 'Choose your backend language (Java/Spring Boot recommended). Set up a new project with a single main class.',
        hint: 'Use Spring Initializr (start.spring.io) with Web dependency.',
    },
    [GameState.LEVEL_CLIENT_SERVER]: {
        stageId: 'monolith',
        task: 'Create a GET /api/health endpoint that returns { "status": "ok", "timestamp": "..." }.',
        hint: 'Use @RestController and @GetMapping in Spring Boot.',
    },

    // --- Stage 2: Structured ---
    [GameState.LEVEL_API_GATEWAY]: {
        stageId: 'structured',
        task: 'Refactor your single controller into separate controller, service, and repository layers. Add DTOs for request/response separation.',
        hint: 'Create an ItemController → ItemService → ItemRepository stack.',
    },
    [GameState.LEVEL_HLD_LLD]: {
        stageId: 'structured',
        task: 'Draw a high-level architecture diagram of your project. Identify all components and their responsibilities.',
        hint: 'Use a tool like draw.io. Label each layer (controller, service, repository, database).',
    },

    // --- Stage 3: DB-Backed ---
    [GameState.LEVEL_DB_INTERNALS]: {
        stageId: 'db-backed',
        task: 'Add PostgreSQL to your project. Create a User entity with @Entity and @Table annotations. Write a Flyway migration (V1__init.sql) for the users table.',
        hint: 'Add spring-boot-starter-data-jpa and postgresql driver to pom.xml.',
    },
    [GameState.LEVEL_DB_MIGRATIONS]: {
        stageId: 'db-backed',
        task: 'Create V2 migration adding a "posts" table with foreign key to users. Add indexes on created_at for time-sorted queries.',
        hint: 'Use CREATE INDEX IF NOT EXISTS for safety.',
    },
    [GameState.LEVEL_DB_SHARDING]: {
        stageId: 'db-backed',
        task: 'Add composite indexes for your most common query patterns. Use EXPLAIN ANALYZE to verify index usage.',
        hint: 'The most impactful index is usually on the column used in WHERE + ORDER BY.',
    },

    // --- Stage 4: Auth-Secured ---
    [GameState.LEVEL_CYBER_ENCRYPTION]: {
        stageId: 'auth-secured',
        task: 'Add a login endpoint. Hash passwords with BCrypt (work factor 12). Return a JWT access token on successful login.',
        hint: 'Use Spring Security\'s BCryptPasswordEncoder.',
    },
    [GameState.LEVEL_CYBER_BCRYPT]: {
        stageId: 'auth-secured',
        task: 'Create a JwtAuthFilter that validates the Bearer token on every request. Extract userId from the token and set it in SecurityContext.',
        hint: 'Extend OncePerRequestFilter and register before UsernamePasswordAuthenticationFilter.',
    },
    [GameState.LEVEL_CYBER_SQLI]: {
        stageId: 'auth-secured',
        task: 'Review all your endpoints for SQL injection vulnerabilities. Ensure all queries use parameterized statements (JPA handles this by default).',
        hint: 'Never concatenate user input into SQL strings. Use @Query with :paramName syntax.',
    },

    // --- Stage 5: Cached ---
    [GameState.LEVEL_CACHING]: {
        stageId: 'cached',
        task: 'Add Redis to your docker-compose. Implement cache-aside pattern: check Redis first, fall back to DB, then cache the result with a 5-minute TTL.',
        hint: 'Use @Cacheable("items") on your service\'s findAll() method.',
    },
    [GameState.LEVEL_CONSISTENT_HASHING]: {
        stageId: 'cached',
        task: 'Add rate limiting to your auth endpoints using Redis INCR + EXPIRE. Limit login to 5 attempts per minute per IP.',
        hint: 'Use a Redis key like "rate:login:{ip}" with INCR and EXPIRE 60.',
    },

    // --- Stage 6: Dockerized ---
    [GameState.LEVEL_DOCKER]: {
        stageId: 'dockerized',
        task: 'Create a multi-stage Dockerfile: stage 1 builds with Maven, stage 2 runs with JRE-alpine. Create docker-compose.yml with app + postgres + redis.',
        hint: 'Use eclipse-temurin:17-jdk-alpine for build and eclipse-temurin:17-jre-alpine for runtime.',
    },

    // --- Stage 7: CI/CD ---
    [GameState.LEVEL_DEVOPS_LOOP]: {
        stageId: 'ci-cd',
        task: 'Create .github/workflows/ci.yml with 4 jobs: lint, test, build-docker-image, deploy-staging. Use GitHub Secrets for credentials.',
        hint: 'Start with a simple workflow that just runs `mvn test` on push to main.',
    },

    // --- Stage 8: Scaled ---
    [GameState.LEVEL_LOAD_BALANCER]: {
        stageId: 'scaled',
        task: 'Add nginx as a reverse proxy in your docker-compose. Configure upstream with 2 backend instances. Add health check routing.',
        hint: 'Use `upstream backend { server app1:8080; server app2:8080; }` in nginx.conf.',
    },
    [GameState.LEVEL_MESSAGE_QUEUES]: {
        stageId: 'scaled',
        task: 'Add async email notifications using Redis Streams or RabbitMQ. When a new post is created, publish an event; a consumer sends the email.',
        hint: 'Use Spring\'s @Async with a bounded thread pool for simple async. Graduate to Redis Streams for durability.',
    },

    // --- Stage 9: Observable ---
    [GameState.LEVEL_FULL_STACK_HOWTO]: {
        stageId: 'observable',
        task: 'Add structured JSON logging with MDC (requestId, userId). Create /actuator/health with DB and Redis health indicators. Expose Prometheus metrics endpoint.',
        hint: 'Use logstash-logback-encoder for JSON. Use @Component implements HealthIndicator for custom checks.',
    },

    // --- Levels WITHOUT project mapping (return null from ApplyThis) ---
    // Gaming levels: GAME_INTRO, GAME_LOOP, GAME_NETWORKING, GAME_PHYSICS, GAME_ARCH, ORDER_BOOK
    // Case studies: CASE_URL_SHORTENER, CASE_INSTAGRAM, CASE_UBER, QUADTREE_DEEP_DIVE
    // Crypto: CYBER_AES, CYBER_RSA, CYBER_SHA
    // LLD patterns: LLD_FACTORY, LLD_OBSERVER
};
