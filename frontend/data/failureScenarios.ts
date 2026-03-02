/**
 * Real-world failure scenarios for each concept.
 * Makes abstract concepts concrete and memorable.
 */

export interface FailureScenario {
    id: string;
    title: string;
    company: string;
    year: string;
    concept: string;
    summary: string;
    timeline: Array<{ time: string; event: string }>;
    rootCause: string;
    impact: string;
    lessonForYourProject: string;
    source?: string;
}

export const failureScenarios: FailureScenario[] = [
    {
        id: 'github-2018-db',
        title: 'GitHub\'s 24-Hour Outage from Database Failover',
        company: 'GitHub',
        year: '2018',
        concept: 'database-internals',
        summary: 'A routine network maintenance caused a MySQL cluster failover. The failover itself worked, but replication lag between data centers caused data inconsistency that took 24+ hours to resolve.',
        timeline: [
            { time: '0:00', event: 'Network maintenance triggers database primary failover to US East' },
            { time: '0:05', event: 'Writes go to new primary, but West Coast replicas are 30s behind' },
            { time: '0:10', event: 'Application reads stale data from replicas — users see missing repos' },
            { time: '1:00', event: 'Engineers attempt fail-back — realize data has diverged on both primaries' },
            { time: '24:00', event: 'Custom reconciliation scripts restore consistency' },
        ],
        rootCause: 'Cross-datacenter replication lag + automatic failover without data consistency checks. The system prioritized availability over consistency (AP over CP in CAP theorem).',
        impact: '24 hours of degraded service. Users saw inconsistent data (PRs missing, commits disappearing then reappearing).',
        lessonForYourProject: 'When you add database replication in your Scaled stage: replication lag is real. Design your read queries to tolerate stale data, and never assume replicas are in sync.',
        source: 'https://github.blog/2018-10-30-oct21-post-incident-analysis/',
    },
    {
        id: 'cloudflare-2019-regex',
        title: 'Cloudflare\'s Global Outage from One Regex',
        company: 'Cloudflare',
        year: '2019',
        concept: 'api-gateway',
        summary: 'A single regex rule deployed to Cloudflare\'s WAF caused catastrophic backtracking, consuming 100% CPU on every edge server worldwide. Global traffic dropped to zero for 27 minutes.',
        timeline: [
            { time: '0:00', event: 'Engineer deploys WAF rule with regex: .*(?:.*=.*)' },
            { time: '0:03', event: 'CPU spikes to 100% across all 194 data centers' },
            { time: '0:05', event: 'All HTTP/HTTPS traffic through Cloudflare drops to 0' },
            { time: '0:10', event: 'Team identifies the WAF rule as cause' },
            { time: '0:27', event: 'Global kill switch disables the rule, traffic recovers' },
        ],
        rootCause: 'Catastrophic regex backtracking. The pattern .*(?:.*=.*) has exponential time complexity on certain inputs. No regex execution timeout. No canary deployment for WAF rules.',
        impact: '~16 million websites went offline simultaneously. Estimated millions in lost revenue across customers.',
        lessonForYourProject: 'When you build request validation in your Auth-secured stage: never use unbounded regex on user input. Set execution timeouts. Always canary-deploy changes to critical path.',
        source: 'https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/',
    },
    {
        id: 'knight-capital-2012',
        title: 'Knight Capital: $440M Lost in 45 Minutes',
        company: 'Knight Capital',
        year: '2012',
        concept: 'ci-cd',
        summary: 'A deployment went wrong: old dead code was accidentally reactivated on one of eight servers. The code executed trades at market prices instead of intended prices, losing $440 million in 45 minutes.',
        timeline: [
            { time: '0:00', event: 'New trading software deployed to 8 servers' },
            { time: '0:01', event: 'One server missed the deployment — runs old code with repurposed flag' },
            { time: '0:05', event: 'Old code executes millions of unintended trades at market prices' },
            { time: '0:15', event: 'Engineers notice anomalous trading volume' },
            { time: '0:45', event: 'Trading halted. $440 million loss confirmed.' },
        ],
        rootCause: 'Manual deployment without verification. Dead code reused a feature flag for a different purpose. No automated deployment validation. No kill switch for trading algorithms.',
        impact: '$440 million loss. Knight Capital went bankrupt and was acquired.',
        lessonForYourProject: 'When you build CI/CD in your CI/CD stage: automate deployments completely. Never leave dead code in production. Implement deployment verification (smoke tests after deploy). Have a kill switch.',
        source: 'https://www.henricodolfing.com/2019/06/project-failure-case-study-knight-capital.html',
    },
    {
        id: 'amazon-2017-s3',
        title: 'AWS S3 Outage: A Typo That Broke the Internet',
        company: 'Amazon',
        year: '2017',
        concept: 'observability',
        summary: 'An engineer mistyped a command while debugging S3\'s billing system, accidentally removing more servers than intended. The cascading failure took down S3 and every service depending on it — most of the internet.',
        timeline: [
            { time: '0:00', event: 'Engineer runs command to remove small number of S3 servers' },
            { time: '0:01', event: 'Typo causes far more servers to be removed than intended' },
            { time: '0:05', event: 'S3 subsystems begin failing as dependencies disappear' },
            { time: '0:15', event: 'Cascading failure: S3 health dashboard (hosted on S3) also goes down' },
            { time: '4:00', event: 'Services gradually restored after manual intervention' },
        ],
        rootCause: 'Human error in a manual operation. No safeguards on the scope of the command. The monitoring dashboard was hosted on the same infrastructure it monitored.',
        impact: 'Estimated $150 million loss across AWS customers. Millions of websites and services went down.',
        lessonForYourProject: 'When you build observability in your Observable stage: never host your monitoring on the same infrastructure it monitors. Add confirmation prompts for destructive operations. Implement blast radius limits.',
        source: 'https://aws.amazon.com/message/41926/',
    },
    {
        id: 'discord-2022-messages',
        title: 'Discord: Scaling to Trillions of Messages',
        company: 'Discord',
        year: '2022',
        concept: 'database-sharding',
        summary: 'Discord migrated from MongoDB to Cassandra, then to ScyllaDB. At trillions of messages, their Cassandra cluster\'s hot partitions caused latency spikes during peak hours.',
        timeline: [
            { time: '2015', event: 'Started with MongoDB — worked fine for millions of messages' },
            { time: '2017', event: 'Migrated to Cassandra for write throughput at scale' },
            { time: '2020', event: 'Hot partitions in Cassandra cause p99 latency spikes (250ms → 5s)' },
            { time: '2022', event: 'Migrated to ScyllaDB — consistent sub-millisecond latency' },
        ],
        rootCause: 'Cassandra\'s consistency model + JVM garbage collection pauses caused tail latency issues. Data model design created hot partitions on popular channels.',
        impact: 'Multi-second message delivery delays for popular servers during peak hours.',
        lessonForYourProject: 'When you design your database schema: think about access patterns and data distribution. A few "popular" entities (channels, users) can create hot spots that no amount of hardware fixes — you need to redesign the partition key.',
        source: 'https://discord.com/blog/how-discord-stores-trillions-of-messages',
    },
    {
        id: 'twitter-2013-cache',
        title: 'Twitter\'s Thundering Herd Problem',
        company: 'Twitter',
        year: '2013',
        concept: 'caching',
        summary: 'A cache expiration on a celebrity\'s profile caused millions of simultaneous database queries — a textbook thundering herd that cascaded into a site-wide outage.',
        timeline: [
            { time: '0:00', event: 'Cache key for @KatyPerry profile expires (100M+ followers)' },
            { time: '0:01', event: 'Millions of timeline renders request the same profile simultaneously' },
            { time: '0:02', event: 'Database connection pool exhausted — queries queue up' },
            { time: '0:05', event: 'Cascading failure: other queries timeout, domino effect across services' },
        ],
        rootCause: 'Simple TTL-based cache expiration without protection against simultaneous misses. No request coalescing. Hot keys had the same TTL as cold keys.',
        impact: 'Partial outage affecting timeline rendering for all users.',
        lessonForYourProject: 'When you add caching in your Cached stage: implement request coalescing (only one request refills the cache, others wait). Add jitter to TTLs. Use cache warming for hot keys.',
    },
];
