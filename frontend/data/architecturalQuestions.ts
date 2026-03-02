/**
 * Architectural thinking questions for each concept module.
 * Open-ended trade-off questions — not factual recall.
 * Tagged by difficulty for adaptive display.
 */

export interface ArchitecturalQuestion {
    id: string;
    question: string;
    context: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    relatedConcepts: string[];
    discussionPoints: string[];
}

export interface ConceptQuestions {
    conceptId: string;
    conceptName: string;
    questions: ArchitecturalQuestion[];
}

export const architecturalQuestions: ConceptQuestions[] = [
    {
        conceptId: 'load-balancing',
        conceptName: 'Load Balancing',
        questions: [
            {
                id: 'lb-1',
                question: 'Your startup just got featured on TechCrunch and traffic spiked 50x. You have one load balancer and 3 backend servers. What breaks first, and how do you fix it without downtime?',
                context: 'Think about single points of failure, connection limits, and health check propagation delays.',
                difficulty: 'intermediate',
                relatedConcepts: ['high-availability', 'autoscaling'],
                discussionPoints: [
                    'The LB itself becomes SPOF — need active-passive LB pair',
                    'Connection queue depth vs. dropping requests',
                    'Health check intervals during rapid scaling',
                ],
            },
            {
                id: 'lb-2',
                question: 'You\'re building a real-time collaborative editor (like Google Docs). Why is round-robin load balancing a terrible choice here, and what would you use instead?',
                context: 'Consider WebSocket connections, session state, and consistency requirements.',
                difficulty: 'advanced',
                relatedConcepts: ['websockets', 'sticky-sessions', 'consistency'],
                discussionPoints: [
                    'WebSocket connections are stateful — round-robin breaks reconnection',
                    'Sticky sessions via consistent hashing on document ID',
                    'Trade-off: sticky sessions reduce LB effectiveness',
                ],
            },
        ],
    },
    {
        conceptId: 'caching',
        conceptName: 'Caching',
        questions: [
            {
                id: 'cache-1',
                question: 'Your e-commerce site shows product prices. Marketing runs flash sales that change prices instantly. You have a 5-minute cache TTL. A customer sees the old (higher) price and completes purchase. Who pays the difference?',
                context: 'This is a real-world cache invalidation problem with legal and business implications.',
                difficulty: 'intermediate',
                relatedConcepts: ['cache-invalidation', 'consistency', 'event-driven'],
                discussionPoints: [
                    'Cache invalidation on price change event vs. short TTL',
                    'Legal: displayed price may be binding (varies by jurisdiction)',
                    'Pattern: event-driven cache bust + optimistic UI',
                ],
            },
            {
                id: 'cache-2',
                question: 'You have 10 million users and your Redis cache holds user sessions. Redis goes down for 2 minutes. What happens to your application, and how do you design for this?',
                context: 'Think about thundering herd, cache-aside vs. write-through, and graceful degradation.',
                difficulty: 'advanced',
                relatedConcepts: ['redis', 'thundering-herd', 'graceful-degradation'],
                discussionPoints: [
                    'Thundering herd: all requests hit DB simultaneously',
                    'Cache-aside + circuit breaker to db',
                    'Redis Sentinel/Cluster for HA, but still need fallback plan',
                ],
            },
        ],
    },
    {
        conceptId: 'database-internals',
        conceptName: 'Database Internals',
        questions: [
            {
                id: 'db-1',
                question: 'Your PostgreSQL query was fast (5ms) last month but now takes 3 seconds. The table grew from 100K to 10M rows. You already have an index on the queried column. What went wrong?',
                context: 'Think beyond "add an index" — consider query plans, index bloat, and statistics.',
                difficulty: 'intermediate',
                relatedConcepts: ['query-planning', 'vacuum', 'index-maintenance'],
                discussionPoints: [
                    'Index bloat from UPDATE-heavy workload — need REINDEX',
                    'Planner statistics stale — ANALYZE not running',
                    'Sequential scan chosen over index scan due to table statistics',
                ],
            },
            {
                id: 'db-2',
                question: 'You need to add a NOT NULL column with a default value to a table with 500 million rows in production. How do you do this without locking the table for 20 minutes?',
                context: 'Consider PostgreSQL version-specific behaviors, online DDL, and migration strategies.',
                difficulty: 'advanced',
                relatedConcepts: ['migrations', 'ddl', 'zero-downtime'],
                discussionPoints: [
                    'PG 11+: adding column with DEFAULT is metadata-only (no rewrite)',
                    'Older PG: 3-phase migration (add nullable → backfill → add constraint)',
                    'Always test DDL on a copy with production data volume',
                ],
            },
        ],
    },
    {
        conceptId: 'api-gateway',
        conceptName: 'API Gateway',
        questions: [
            {
                id: 'gw-1',
                question: 'Your API gateway handles authentication, rate limiting, logging, and request transformation. It crashes. What happens to ALL your backend services, and how should you have designed this?',
                context: 'Think about single point of failure vs. distributed responsibility.',
                difficulty: 'intermediate',
                relatedConcepts: ['spof', 'service-mesh', 'sidecar-pattern'],
                discussionPoints: [
                    'Gateway = single point of failure for entire platform',
                    'Sidecar pattern: move auth/rate-limit to per-service sidecars',
                    'Gateway fleet with DNS-based load balancing',
                ],
            },
        ],
    },
    {
        conceptId: 'message-queues',
        conceptName: 'Message Queues',
        questions: [
            {
                id: 'mq-1',
                question: 'Your payment service publishes "payment_completed" to a queue. The order service consumes it and ships the item. The message is processed twice due to a consumer crash mid-ack. The customer gets 2 shipments. How do you prevent this?',
                context: 'This is the classic exactly-once delivery problem.',
                difficulty: 'intermediate',
                relatedConcepts: ['idempotency', 'exactly-once', 'distributed-systems'],
                discussionPoints: [
                    'Exactly-once delivery is impossible — design for at-least-once + idempotency',
                    'Idempotency key on order ID — check before processing',
                    'Outbox pattern for reliable event publishing',
                ],
            },
            {
                id: 'mq-2',
                question: 'Your queue has 2 million messages backlogged. Adding more consumers isn\'t reducing the backlog. Why? What\'s your next move?',
                context: 'Consider partition count, consumer group mechanics, and poison messages.',
                difficulty: 'advanced',
                relatedConcepts: ['partitioning', 'consumer-groups', 'dead-letter-queue'],
                discussionPoints: [
                    'Consumers > partitions = idle consumers. Need more partitions.',
                    'Poison messages: one bad message blocks partition. Need DLQ.',
                    'Consumer processing time > production rate — need faster consumers or batching',
                ],
            },
        ],
    },
    {
        conceptId: 'docker',
        conceptName: 'Docker & Containerization',
        questions: [
            {
                id: 'docker-1',
                question: 'Your Docker image is 2.1 GB. Deployment takes 8 minutes per node (you have 20 nodes). How do you get this under 200 MB and deploy in under 1 minute?',
                context: 'Think about multi-stage builds, layer caching, and base image selection.',
                difficulty: 'beginner',
                relatedConcepts: ['multi-stage-builds', 'alpine', 'layer-caching'],
                discussionPoints: [
                    'Multi-stage: build stage has SDK, runtime stage has only JRE',
                    'Alpine base saves ~800 MB over Ubuntu',
                    'Layer ordering: dependencies before source code for cache hits',
                ],
            },
        ],
    },
    {
        conceptId: 'ci-cd',
        conceptName: 'CI/CD Pipelines',
        questions: [
            {
                id: 'cicd-1',
                question: 'Your CI pipeline takes 45 minutes. Developers push 20 PRs/day. They\'re skipping CI and merging with "YOLO" commits. How do you fix this without adding more hardware?',
                context: 'Think about parallelization, caching, and selective testing.',
                difficulty: 'intermediate',
                relatedConcepts: ['test-pyramid', 'parallelization', 'affected-tests'],
                discussionPoints: [
                    'Selective testing: only run tests affected by changed files',
                    'Parallel test execution across workers',
                    'Cache dependencies (node_modules, .m2, Docker layers)',
                    'Split: fast checks first (lint, types), slow tests as async gate',
                ],
            },
        ],
    },
    {
        conceptId: 'observability',
        conceptName: 'Observability & Monitoring',
        questions: [
            {
                id: 'obs-1',
                question: 'It\'s 3 AM. PagerDuty wakes you up: "5xx error rate > 5% for 10 minutes." You SSH into the server. Walk me through your first 5 commands and what you\'re looking for.',
                context: 'This is a war room scenario — systematic debugging under pressure.',
                difficulty: 'intermediate',
                relatedConcepts: ['debugging', 'logs', 'metrics', 'traces'],
                discussionPoints: [
                    '1. check dashboard/metrics for pattern (specific endpoint? all?)',
                    '2. tail logs for error patterns (grep for stack traces)',
                    '3. check system resources (CPU, memory, disk, connections)',
                    '4. check dependencies (DB, Redis, external APIs)',
                    '5. check recent deployments (git log, deploy history)',
                ],
            },
        ],
    },
];
