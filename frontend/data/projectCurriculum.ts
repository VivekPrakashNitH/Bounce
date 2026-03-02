import { GameState } from '../types';

/**
 * The 9-stage evolving backend project that learners build incrementally.
 * Each stage maps to a set of teaching levels that feed into it.
 */

export interface ProjectStage {
    id: string;
    number: number;
    title: string;
    subtitle: string;
    description: string;
    /** What the learner builds in this stage */
    projectTask: string;
    /** GameState levels that teach concepts for this stage */
    feedingLevels: GameState[];
    /** Skills demonstrated by completing this stage */
    skills: string[];
    /** Estimated time in minutes */
    estimatedMinutes: number;
}

export const PROJECT_STAGES: ProjectStage[] = [
    {
        id: 'monolith',
        number: 1,
        title: 'Monolith',
        subtitle: 'Single-File Server',
        description: 'Build a single-file backend with one REST endpoint. Understand the client-server model and pick your language.',
        projectTask: 'Create a Spring Boot app with a single GET /api/health endpoint that returns { status: "ok", timestamp }.',
        feedingLevels: [
            GameState.LEVEL_BACKEND_LANGUAGES,
            GameState.LEVEL_CLIENT_SERVER,
        ],
        skills: ['HTTP basics', 'REST endpoints', 'Server setup'],
        estimatedMinutes: 30,
    },
    {
        id: 'structured',
        number: 2,
        title: 'Structured',
        subtitle: 'Controllers → Services → Repositories',
        description: 'Refactor your monolith into a layered architecture. Separate concerns with controllers, services, and DTOs.',
        projectTask: 'Refactor into Controller → Service → Repository layers. Add a /api/items CRUD endpoint with in-memory storage.',
        feedingLevels: [
            GameState.LEVEL_API_GATEWAY,
            GameState.LEVEL_HLD_LLD,
        ],
        skills: ['Layered architecture', 'Dependency injection', 'API design'],
        estimatedMinutes: 45,
    },
    {
        id: 'db-backed',
        number: 3,
        title: 'DB-Backed',
        subtitle: 'PostgreSQL + Flyway',
        description: 'Add a real database. Model entities with JPA, manage schema with Flyway migrations, and learn query optimization.',
        projectTask: 'Add PostgreSQL. Create a User entity with Flyway migration. Implement user CRUD with proper validation.',
        feedingLevels: [
            GameState.LEVEL_DB_INTERNALS,
            GameState.LEVEL_DB_MIGRATIONS,
            GameState.LEVEL_DB_SHARDING,
        ],
        skills: ['SQL', 'ORM', 'Schema migrations', 'Indexing'],
        estimatedMinutes: 60,
    },
    {
        id: 'auth-secured',
        number: 4,
        title: 'Auth-Secured',
        subtitle: 'JWT + Password Hashing',
        description: 'Secure your API with JWT authentication, password hashing, and role-based access control.',
        projectTask: 'Add JWT login/register with BCrypt password hashing. Protect CRUD endpoints — only authenticated users can create/update.',
        feedingLevels: [
            GameState.LEVEL_CYBER_ENCRYPTION,
            GameState.LEVEL_CYBER_BCRYPT,
            GameState.LEVEL_CYBER_SQLI,
        ],
        skills: ['JWT', 'BCrypt', 'Auth middleware', 'Input validation'],
        estimatedMinutes: 60,
    },
    {
        id: 'cached',
        number: 5,
        title: 'Cached',
        subtitle: 'Redis Caching Layer',
        description: 'Add Redis caching for read-heavy endpoints. Learn cache-aside pattern, TTLs, and invalidation strategies.',
        projectTask: 'Add Redis. Cache GET /api/items responses with 5-min TTL. Invalidate on write. Add rate limiting on auth endpoints.',
        feedingLevels: [
            GameState.LEVEL_CACHING,
            GameState.LEVEL_CONSISTENT_HASHING,
        ],
        skills: ['Cache-aside', 'TTL', 'Cache invalidation', 'Rate limiting'],
        estimatedMinutes: 45,
    },
    {
        id: 'dockerized',
        number: 6,
        title: 'Dockerized',
        subtitle: 'Containerized Deployment',
        description: 'Containerize your entire stack with multi-stage Dockerfiles and Docker Compose orchestration.',
        projectTask: 'Create multi-stage Dockerfile (build with Maven/Gradle, run with JRE-alpine). Add docker-compose.yml with app + postgres + redis.',
        feedingLevels: [
            GameState.LEVEL_DOCKER,
        ],
        skills: ['Docker', 'Multi-stage builds', 'Compose', 'Networking'],
        estimatedMinutes: 45,
    },
    {
        id: 'ci-cd',
        number: 7,
        title: 'CI/CD',
        subtitle: 'Automated Pipeline',
        description: 'Set up a GitHub Actions pipeline that tests, builds, and deploys your containerized application automatically.',
        projectTask: 'Create .github/workflows/ci.yml: lint → test → build Docker image → push. Add a staging deploy step.',
        feedingLevels: [
            GameState.LEVEL_DEVOPS_LOOP,
        ],
        skills: ['CI/CD', 'GitHub Actions', 'Automated testing', 'Deployment'],
        estimatedMinutes: 30,
    },
    {
        id: 'scaled',
        number: 8,
        title: 'Scaled',
        subtitle: 'Horizontal Scaling',
        description: 'Configure your app for horizontal scaling: load balancing, message queues for async processing, and database read replicas.',
        projectTask: 'Add nginx load balancer in front of 2 backend instances. Add a message queue (Redis Streams) for async email notifications.',
        feedingLevels: [
            GameState.LEVEL_LOAD_BALANCER,
            GameState.LEVEL_MESSAGE_QUEUES,
        ],
        skills: ['Load balancing', 'Async processing', 'Message queues', 'Horizontal scaling'],
        estimatedMinutes: 60,
    },
    {
        id: 'observable',
        number: 9,
        title: 'Observable',
        subtitle: 'Logging, Metrics & Health',
        description: 'Add structured logging, health checks, and application metrics. Make your system debuggable and monitorable in production.',
        projectTask: 'Add structured JSON logging with MDC. Create /actuator/health with custom DB + Redis health indicators. Expose Prometheus metrics.',
        feedingLevels: [
            GameState.LEVEL_FULL_STACK_HOWTO,
        ],
        skills: ['Structured logging', 'Health checks', 'Metrics', 'Observability'],
        estimatedMinutes: 45,
    },
];

/** Quick lookup: GameState → stage that it feeds */
export const LEVEL_TO_STAGE_MAP: Record<string, string> = {};
for (const stage of PROJECT_STAGES) {
    for (const level of stage.feedingLevels) {
        LEVEL_TO_STAGE_MAP[level] = stage.id;
    }
}

/** Get a stage by id */
export const getStageById = (id: string): ProjectStage | undefined =>
    PROJECT_STAGES.find(s => s.id === id);

/** Get the next stage after the given one */
export const getNextStage = (currentId: string): ProjectStage | undefined => {
    const current = PROJECT_STAGES.find(s => s.id === currentId);
    if (!current) return undefined;
    return PROJECT_STAGES.find(s => s.number === current.number + 1);
};

/** Total estimated time across all stages */
export const TOTAL_ESTIMATED_MINUTES = PROJECT_STAGES.reduce((sum, s) => sum + s.estimatedMinutes, 0);
