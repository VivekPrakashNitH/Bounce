
import { GameState, CourseLevel } from '../types';

export const COURSE_CONTENT: CourseLevel[] = [
  // --- MODULE 0: LANGUAGES & CONCEPTS ---
  {
    id: GameState.LEVEL_HLD_LLD,
    title: "HLD vs LLD",
    description: "Understanding the difference between System Architecture and Class Design.",
    category: 'Fundamentals',
    topics: ["Architecture", "Class Diagrams", "Scalability", "Clean Code"],
    realWorldUses: ["Planning a new feature", "Code Reviews", "System Architecture Documents"],
    pros: ["Clear separation of concerns", "Better scalability planning (HLD)", "Maintainable code (LLD)"],
    cons: ["Over-engineering risks", "Documentation overhead"],
    quiz: {
      question: "Which belongs to Low Level Design (LLD)?",
      options: ["Choosing a Database", "Load Balancer Strategy", "Class Inheritance Hierarchy"],
      correctIndex: 2,
      explanation: "LLD focuses on the internal logic, classes, and function signatures. DB and Load Balancers are HLD."
    }
  },
  {
    id: GameState.LEVEL_BACKEND_LANGUAGES,
    title: "Backend Languages & Runtimes",
    description: "Choosing the right tool: Node vs Go vs Rust vs Java.",
    category: 'Languages',
    topics: ["Concurrency Models", "Memory Management", "Ecosystems"],
    realWorldUses: ["High Frequency Trading (C++)", "Microservices (Go)", "Enterprise Monoliths (Java)"],
    pros: ["Performance (Rust/C++)", "Dev Velocity (Node)", "Scalability (Go/Elixir)"],
    cons: ["Memory safety risks (C++)", "GC pauses (Java)", "Single Thread (Node)"],
    codeSnippet: {
      title: "Go HTTP Server",
      language: "go",
      description: "Simple, concurrent HTTP server in Go.",
      code: `package main
import ("fmt"; "net/http")

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello from Go!")
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}`
    }
  },
  // --- MODULE 1: FUNDAMENTALS ---
  {
    id: GameState.LEVEL_CLIENT_SERVER,
    title: "Client-Server Architecture",
    description: "The fundamental request-response cycle powering the web.",
    category: 'Fundamentals',
    topics: ["HTTP/HTTPS", "DNS", "TCP/IP", "Request/Response"],
    realWorldUses: ["Browsing a website", "Mobile apps fetching data", "REST APIs"],
    pros: ["Centralized control", "Easier to maintain security", "Scalable servers"],
    cons: ["Single point of failure (if 1 server)", "Network latency issues"],
    quiz: {
      question: "If the server goes down in a basic Client-Server model, what happens?",
      options: ["The client automatically fixes it", "The service becomes unavailable", "Another server appears magically"],
      correctIndex: 1,
      explanation: "Without redundancy (like Load Balancers), a single server failure kills the service."
    },
    codeSnippet: {
      title: "Basic Express Server",
      language: "typescript",
      description: "A simple Node.js server handling a GET request.",
      code: `import express from 'express';
const app = express();
app.get('/user/:id', (req, res) => {
  res.status(200).json({ id: req.params.id, name: "Alice" });
});
app.listen(3000);`
    }
  },
  {
    id: GameState.LEVEL_LOAD_BALANCER,
    title: "Load Balancing",
    description: "Distributing traffic across servers (L4 vs L7).",
    category: 'Fundamentals',
    topics: ["Round Robin", "Active-Passive", "L4 Transport", "L7 Application"],
    realWorldUses: ["Handling millions of users (Facebook, Google)", "Preventing server overload"],
    pros: ["High Availability", "Scalability", "Health Checks"],
    cons: ["Additional complexity", "Can become a bottleneck itself"],
    quiz: {
      question: "Which algorithm sends requests to servers sequentially?",
      options: ["Least Connections", "Round Robin", "IP Hash"],
      correctIndex: 1,
      explanation: "Round Robin cycles through the server list 1-by-1."
    },
    codeSnippet: {
      title: "Nginx Load Balancer",
      language: "nginx",
      description: "Distributing traffic to 3 backend servers.",
      code: `upstream backend {
  server backend1.example.com;
  server backend2.example.com;
  server backend3.example.com;
}
server {
  location / {
    proxy_pass http://backend;
  }
}`
    }
  },
  {
    id: GameState.LEVEL_API_GATEWAY,
    title: "API Gateway",
    description: "Single entry point for microservices.",
    category: 'Fundamentals',
    topics: ["Authentication", "Rate Limiting", "Routing", "BFF"],
    realWorldUses: ["Netflix API", "Public facing APIs", "Microservices orchestration"],
    pros: ["Unified entry point", "Offloads SSL/Auth", "Rate Limiting"],
    cons: ["Possible single point of failure", "Increased latency"],
    codeSnippet: {
      title: "Gateway Routing",
      language: "javascript",
      description: "Routing requests based on path.",
      code: `app.use('/users', createProxyMiddleware({ target: 'http://users:3000' }));
app.use('/orders', createProxyMiddleware({ target: 'http://orders:3000' }));`
    }
  },

  // --- MODULE 2: DATA ---
  {
    id: GameState.LEVEL_CACHING,
    title: "Distributed Caching (LRU)",
    description: "Eviction policies and caching strategies.",
    category: 'Data',
    topics: ["LRU (Least Recently Used)", "LFU", "Cache-Aside", "Redis"],
    realWorldUses: ["Session storage", "Leaderboards", "Product details pages"],
    pros: ["Extremely fast reads", "Reduces load on DB"],
    cons: ["Cache invalidation is hard", "Data inconsistency"],
    quiz: {
      question: "In LRU Cache, which item is removed first when full?",
      options: ["The random one", "The most recently used", "The least recently used"],
      correctIndex: 2,
      explanation: "LRU evicts the item that hasn't been accessed for the longest time."
    },
    codeSnippet: {
      title: "Redis Cache-Aside",
      language: "javascript",
      description: "Check cache, then DB, then write to cache.",
      code: `const data = await redis.get(key);
if (data) return JSON.parse(data);
const dbData = await db.find(key);
await redis.set(key, JSON.stringify(dbData));`
    }
  },
  {
    id: GameState.LEVEL_DB_SHARDING,
    title: "Database Sharding",
    description: "Horizontal scaling of databases.",
    category: 'Data',
    topics: ["Horizontal Scaling", "Shard Keys", "Rebalancing"],
    realWorldUses: ["Storing billions of messages (Discord, Slack)", "Global user data"],
    pros: ["Infinite scaling potential", "Faster queries on small shards"],
    cons: ["Complex cross-shard joins", "Rebalancing is difficult"],
    codeSnippet: {
      title: "Sharding Logic",
      language: "javascript",
      description: "Selecting a shard based on User ID.",
      code: `function getShard(userId) {
  // Simple Modulo Sharding
  return \`db-shard-\${userId % 4}\`; 
}`
    }
  },
  {
    id: GameState.LEVEL_CONSISTENT_HASHING,
    title: "Consistent Hashing",
    description: "Distributing data in a ring to minimize rebalancing.",
    category: 'Data',
    topics: ["Hash Ring", "Virtual Nodes", "Partitioning"],
    realWorldUses: ["DynamoDB", "Cassandra", "Discord Messages"],
    pros: ["Minimal data movement when scaling", "Decentralized"],
    cons: ["Implementation complexity", "Hotspot management"],
    quiz: {
      question: "What is the benefit of Consistent Hashing over Modulo Hashing?",
      options: ["It uses less memory", "Only k/N keys move when a node is added", "It is faster to calculate"],
      correctIndex: 1,
      explanation: "In Modulo hashing, changing N (nodes) reshuffles almost ALL keys. Consistent hashing only moves keys belonging to the affected segment."
    },
    codeSnippet: {
      title: "Consistent Hash Ring",
      language: "java",
      description: "Finding the nearest node on the ring.",
      code: `SortedMap<Integer, String> circle = new TreeMap<>();
// Add Node
circle.put(hash("NodeA"), "NodeA");

// Find Node for Key
int keyHash = hash("User123");
if (!circle.containsKey(keyHash)) {
    SortedMap<Integer, String> tailMap = circle.tailMap(keyHash);
    keyHash = tailMap.isEmpty() ? circle.firstKey() : tailMap.firstKey();
}
return circle.get(keyHash);`
    }
  },
  {
    id: GameState.LEVEL_DB_INTERNALS,
    title: "DB Internals: B-Tree vs LSM",
    description: "How databases actually store data on disk.",
    category: 'Data',
    topics: ["B-Tree", "LSM Tree", "WAL (Write Ahead Log)", "SSTables"],
    realWorldUses: ["PostgreSQL (B-Tree)", "Cassandra/ScyllaDB (LSM)", "Embedded DBs"],
    pros: ["B-Trees: Fast reads", "LSM: Fast writes", "WAL: Durability"],
    cons: ["B-Trees: Slower writes", "LSM: Compaction overhead"],
    quiz: {
      question: "Which structure is optimized for Write-Heavy workloads?",
      options: ["B-Tree", "LSM Tree", "Linked List"],
      correctIndex: 1,
      explanation: "LSM (Log Structured Merge) Trees simply append data, making writes extremely fast compared to B-Trees."
    }
  },
  {
    id: GameState.LEVEL_DB_MIGRATIONS,
    title: "Migrations (Alembic)",
    description: "Version control for your Database Schema.",
    category: 'Data',
    topics: ["Schema Evolution", "Up/Down Scripts", "State Management"],
    realWorldUses: ["Production deployments", "Team collaboration on DBs"],
    pros: ["Reproducible DB state", "Safe rollbacks"],
    cons: ["Merge conflicts in migration files", "Data migration complexity"],
    codeSnippet: {
      title: "Alembic Migration (Python)",
      language: "python",
      description: "Adding a column to a user table.",
      code: `def upgrade():
    op.add_column('users', sa.Column('email', sa.String(50)))

def downgrade():
    op.drop_column('users', 'email')`
    }
  },

  // --- MODULE 3: COMMUNICATION ---
  {
    id: GameState.LEVEL_MESSAGE_QUEUES,
    title: "Message Queues",
    description: "Asynchronous communication using Pub/Sub.",
    category: 'Communication',
    topics: ["Kafka", "RabbitMQ", "Producers/Consumers", "Decoupling"],
    realWorldUses: ["Email sending services", "Order processing", "Video transcoding"],
    pros: ["Decoupling", "Traffic spike buffering", "Reliability"],
    cons: ["Message ordering issues", "Complexity of consumer management"],
    codeSnippet: {
      title: "RabbitMQ Producer",
      language: "javascript",
      description: "Sending a message to a queue.",
      code: `const channel = await connection.createChannel();
const queue = 'task_queue';
channel.sendToQueue(queue, Buffer.from('Hello World'));`
    }
  },
  {
    id: GameState.LEVEL_DOCKER,
    title: "Containerization",
    description: "Isolation and deployment with Docker.",
    category: 'Communication',
    topics: ["Images", "Containers", "Kubernetes", "Isolation"],
    realWorldUses: ["Microservices deployment", "CI/CD pipelines", "Reproducible builds"],
    pros: ["Works on my machine", "Lightweight", "Fast startup"],
    cons: ["Security config can be tricky", "Orchestration learning curve"],
    codeSnippet: {
      title: "Dockerfile",
      language: "dockerfile",
      description: "Building a Node image.",
      code: `FROM node:alpine
WORKDIR /app
COPY . .
CMD ["npm", "start"]`
    }
  },
  {
    id: GameState.LEVEL_DEVOPS_LOOP,
    title: "The DevOps Infinite Loop",
    description: "Visualizing the automated cycle of software delivery.",
    category: 'DevOps',
    topics: ["CI/CD", "Jenkins/Github Actions", "Monitoring", "Infrastructure as Code"],
    realWorldUses: ["Daily deployments", "Automated testing", "Site Reliability Engineering (SRE)"],
    pros: ["Faster time to market", "Fewer bugs in production", "Automated recovery"],
    cons: ["Complex tooling maintenance", "Pipeline costs"],
    codeSnippet: {
      title: "GitHub Actions Workflow",
      language: "yaml",
      description: "Automated test and deploy script.",
      code: `name: CI/CD
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
      - run: npm run deploy`
    }
  },

  // --- MODULE 4: GAME ENGINEERING ---
  {
    id: GameState.LEVEL_GAME_INTRO,
    title: "Let's Build a Game Engine",
    description: "How to build a game from scratch: Init, Loop, Render.",
    category: 'Gaming',
    topics: ["Initialization", "The Loop", "Rendering", "Input Handling"],
    realWorldUses: ["Building Custom Engines", "Understanding Unity/Unreal under the hood"],
    pros: ["Total Control", "Maximum Performance"],
    cons: ["High complexity", "Reinventing the wheel"],
    codeSnippet: {
      title: "Game Engine Skeleton (C++)",
      language: "cpp",
      description: "The main entry point for a game.",
      code: `class Game {
public:
    void init() {
        window.create("My Game");
        assets.load("textures.pak");
    }

    void run() {
        while (window.isOpen()) {
            input.process();
            update(deltaTime);
            render();
        }
    }

    void cleanup() {
        window.close();
    }
};

int main() {
    Game game;
    game.init();
    game.run(); // Enter the infinite loop
    game.cleanup();
}`
    }
  },
  {
    id: GameState.LEVEL_GAME_LOOP,
    title: "The Game Loop",
    description: "How lines of C++ code become moving pixels.",
    category: 'Gaming',
    topics: ["Input", "Update", "Render", "Delta Time", "Frame Pacing"],
    realWorldUses: ["Unreal Engine", "Unity", "Custom Game Engines"],
    pros: ["Precise control over execution", "Optimization opportunities"],
    cons: ["High CPU usage if not managed", "Complexity in multithreading"],
    codeSnippet: {
      title: "Basic Game Loop (C++)",
      language: "cpp",
      description: "The heartbeat of every game engine.",
      code: `while (gameRunning) {
    double current = getCurrentTime();
    double elapsed = current - previous;
    previous = current;
    
    processInput();
    update(elapsed);
    render();
}`
    }
  },
  {
    id: GameState.LEVEL_GAME_NETWORKING,
    title: "Networking: TCP vs UDP",
    description: "Why Multiplayer Games use UDP over TCP.",
    category: 'Gaming',
    topics: ["Sockets", "Packet Loss", "Reliability vs Speed", "Interpolation"],
    realWorldUses: ["FPS Games (UDP)", "MMORPGs (Mixed)", "Chat (TCP)"],
    pros: ["UDP: Lowest Latency", "TCP: Guaranteed Delivery"],
    cons: ["UDP: Packet Loss", "TCP: Head-of-line Blocking"],
    quiz: {
      question: "Why is UDP better for player movement in FPS games?",
      options: ["It encrypts data better", "We care about the *latest* position, not *every* position", "It uses less bandwidth"],
      correctIndex: 1,
      explanation: "If a movement packet is lost, we don't want to wait for it. We just want the NEWEST packet showing where the player is NOW."
    },
    codeSnippet: {
      title: "UDP Socket (C++)",
      language: "cpp",
      description: "Sending a 'fire and forget' packet.",
      code: `// Create UDP Socket
int sock = socket(AF_INET, SOCK_DGRAM, 0);

// Player Position Data
struct Packet { float x, y; };
Packet p = { 10.5f, 20.0f };

// Send (No connection handshake needed)
sendto(sock, &p, sizeof(p), 0, (struct sockaddr*)&addr, sizeof(addr));`
    }
  },
  {
    id: GameState.LEVEL_GAME_PHYSICS,
    title: "Hit Detection: Math of Shooting",
    description: "Raycasting (Hitscan) vs Projectiles.",
    category: 'Gaming',
    topics: ["Raycasting", "Vectors", "Hitboxes", "Ballistics"],
    realWorldUses: ["Call of Duty (Hitscan)", "Battlefield (Projectiles)", "Physics Simulations"],
    pros: ["Hitscan: Instant feedback", "Projectile: Realistic skill ceiling"],
    cons: ["Hitscan: Less realistic", "Projectile: Complex networking"],
    codeSnippet: {
      title: "Simple Raycast (C++)",
      language: "cpp",
      description: "Checking if a laser hits a target.",
      code: `bool Raycast(Vector3 origin, Vector3 direction, float maxDist) {
    // Check every object in the world
    for (Object obj : worldObjects) {
        // Math to check line intersection with object box
        if (Intersect(origin, direction, obj.box)) {
            return true; // Hit!
        }
    }
    return false;
}`
    }
  },
  {
    id: GameState.LEVEL_GAME_ARCH,
    title: "Game Architecture: PUBG / Royale",
    description: "How games handle 100 players concurrently.",
    category: 'Gaming',
    topics: ["Authoritative Server", "Client Prediction", "Replication", "Tick Rate"],
    realWorldUses: ["Battle Royale Games", "MMORPGs", "Real-time Simulations"],
    pros: ["Massive scale", "Prevents cheating (Server Authority)"],
    cons: ["Network jitter", "High server CPU cost"],
    quiz: {
      question: "What is 'Server Authority'?",
      options: ["The server has the best graphics", "The server decides what actually happened (Truth)", "The client controls the server"],
      correctIndex: 1,
      explanation: "To prevent cheating, the client sends inputs ('I moved forward'), and the server calculates the result ('You are now at X,Y')."
    }
  },
  {
    id: GameState.LEVEL_ORDER_BOOK,
    title: "C++ Project: Order Matching Engine",
    description: "Visualizing a Limit Order Book for Stock Trading.",
    category: 'Gaming', // It fits here as high-perf simulation
    topics: ["Limit Orders", "Market Orders", "Matching Algorithms", "Low Latency"],
    realWorldUses: ["NASDAQ/NYSE", "Crypto Exchanges", "HFT Firms"],
    pros: ["Microsecond latency", "Highly optimized C++"],
    cons: ["Extremely complex error handling", "Zero tolerance for bugs"],
    codeSnippet: {
      title: "Order Matching (C++)",
      language: "cpp",
      description: "The core logic for matching a Buy order with a Sell order.",
      code: `void match(Order& incoming) {
    while (!orderBook.empty() && incoming.qty > 0) {
        Order& best = orderBook.top(); // Best price
        
        if (incoming.price >= best.price) {
            int tradeQty = min(incoming.qty, best.qty);
            executeTrade(incoming, best, tradeQty);
            
            incoming.qty -= tradeQty;
            best.qty -= tradeQty;
            if (best.qty == 0) orderBook.pop();
        } else {
            break; // No match possible
        }
    }
}`
    }
  },

  // --- MODULE 7: CYBERSECURITY ---
  {
    id: GameState.LEVEL_CYBER_ENCRYPTION,
    title: "Cryptography: Encryption & MITM",
    description: "How to protect data from eavesdroppers (Man-in-the-Middle).",
    category: 'Cybersecurity',
    topics: ["Symmetric (AES)", "Asymmetric (RSA)", "MITM Attacks", "TLS/SSL"],
    realWorldUses: ["HTTPS (Web Browsing)", "WhatsApp E2E Encryption", "Secure Banking"],
    pros: ["Data Confidentiality", "Integrity (Tamper proof)"],
    cons: ["Key Management is hard", "Performance overhead"],
    quiz: {
      question: "In Public Key Encryption, which key do you use to encrypt a message for Bob?",
      options: ["Your Private Key", "Bob's Public Key", "Bob's Private Key"],
      correctIndex: 1,
      explanation: "You encrypt with the recipient's (Bob's) Public Key. Only Bob's Private Key can decrypt it."
    },
    codeSnippet: {
      title: "AES Encryption (Python)",
      language: "python",
      description: "Encrypting a secret message.",
      code: `from cryptography.fernet import Fernet

key = Fernet.generate_key()
cipher = Fernet(key)

msg = b"Attack at dawn"
encrypted = cipher.encrypt(msg)
# Output: b'gAAAAAB...'

print(cipher.decrypt(encrypted))`
    }
  },
  {
    id: GameState.LEVEL_CYBER_SQLI,
    title: "Web Security: SQL Injection",
    description: "The most dangerous web vulnerability explained.",
    category: 'Cybersecurity',
    topics: ["Input Validation", "Prepared Statements", "OWASP Top 10"],
    realWorldUses: ["Pentesting", "Securing Login Forms", "Bug Bounties"],
    pros: ["Preventing data leaks", "Protecting admin access"],
    cons: ["Requires disciplined coding", "Legacy code vulnerability"],
    quiz: {
      question: "How do you fix SQL Injection?",
      options: ["Use a better firewall", "Sanitize inputs manually", "Use Parameterized Queries"],
      correctIndex: 2,
      explanation: "Parameterized Queries (Prepared Statements) treat input as data, not executable code, neutralizing the attack."
    },
    codeSnippet: {
      title: "Vulnerable vs Secure SQL",
      language: "javascript",
      description: "Why string concatenation is dangerous.",
      code: `// ❌ VULNERABLE
const query = "SELECT * FROM users WHERE name = '" + userInput + "'";

// ✅ SECURE (Parameterized)
const query = "SELECT * FROM users WHERE name = ?";
db.execute(query, [userInput]);`
    }
  },
  {
    id: GameState.LEVEL_CYBER_AES,
    title: "AES: Symmetric Encryption",
    description: "Understanding the Advanced Encryption Standard block cipher.",
    category: 'Cybersecurity',
    topics: ["Block Cipher", "16-byte Blocks", "SubBytes", "ShiftRows", "MixColumns", "Key Expansion"],
    realWorldUses: ["HTTPS/TLS", "Disk Encryption (BitLocker)", "WhatsApp (Signal Protocol)"],
    pros: ["Very fast in hardware", "Proven secure (used by US Gov)", "Small key size for strong security"],
    cons: ["Key distribution problem", "Same key for encrypt/decrypt"],
    quiz: {
      question: "AES-128 operates on blocks of what size?",
      options: ["64 bits", "128 bits (16 bytes)", "256 bits"],
      correctIndex: 1,
      explanation: "AES always uses 128-bit (16-byte) blocks, regardless of key size. The key can be 128, 192, or 256 bits."
    }
  },
  {
    id: GameState.LEVEL_CYBER_RSA,
    title: "RSA: Public Key Cryptography",
    description: "The mathematics behind secure key exchange.",
    category: 'Cybersecurity',
    topics: ["Prime Factorization", "Public/Private Keys", "Modular Exponentiation", "Digital Signatures"],
    realWorldUses: ["SSL Certificates", "PGP Email", "SSH Keys", "Cryptocurrency Wallets"],
    pros: ["Solves key distribution problem", "Enables digital signatures", "Non-repudiation"],
    cons: ["Slow for large data", "Key sizes are large (2048+ bits)", "Quantum vulnerability"],
    quiz: {
      question: "In RSA, which key encrypts data that only the recipient can read?",
      options: ["Sender's Private Key", "Recipient's Public Key", "Shared Secret Key"],
      correctIndex: 1,
      explanation: "You encrypt with the recipient's Public Key. Only their Private Key can decrypt it."
    }
  },
  {
    id: GameState.LEVEL_CYBER_SHA,
    title: "SHA-256: Cryptographic Hashing",
    description: "One-way functions that power blockchain and password storage.",
    category: 'Cybersecurity',
    topics: ["Message Digest", "Collision Resistance", "Merkle-Damgård", "Bitcoin PoW"],
    realWorldUses: ["Bitcoin Mining", "Git Commits", "Password Verification", "Data Integrity"],
    pros: ["Fixed output size (256 bits)", "Irreversible", "Collision resistance"],
    cons: ["Not encryption (can't reverse)", "No key involved"],
    quiz: {
      question: "What is a key property of a cryptographic hash function?",
      options: ["It can be reversed", "It produces variable-length output", "Small input changes create completely different output"],
      correctIndex: 2,
      explanation: "The 'avalanche effect' means changing 1 bit in input changes ~50% of output bits."
    }
  },
  {
    id: GameState.LEVEL_CYBER_BCRYPT,
    title: "Bcrypt: Password Hashing",
    description: "Why slow hashing protects passwords from brute force attacks.",
    category: 'Cybersecurity',
    topics: ["Salting", "Cost Factor", "Blowfish", "Key Stretching"],
    realWorldUses: ["User Authentication", "Password Storage", "Auth0/Firebase Auth"],
    pros: ["Intentionally slow (tunable)", "Built-in salt", "Resistant to GPU attacks"],
    cons: ["Slow by design (affects performance)", "Memory bound"],
    quiz: {
      question: "Why is bcrypt better than SHA-256 for password hashing?",
      options: ["It produces longer output", "It is intentionally slow to prevent brute-force", "It uses less memory"],
      correctIndex: 1,
      explanation: "Bcrypt's cost factor makes it adjustable slow, so attackers can't try billions of passwords per second."
    }
  },

  // --- MODULE 6: FULL STACK ---
  {
    id: GameState.LEVEL_FULL_STACK_HOWTO,
    title: "Full Stack Guide: How This App Works",
    description: "Connecting Frontend, Backend, and Database.",
    category: 'Full Stack',
    topics: ["React", "REST API", "Node.js", "PostgreSQL", "ORM"],
    realWorldUses: ["Building this website", "SaaS Applications"],
    pros: ["Persistent Data (Comments saved forever)", "Security", "Scalability"],
    cons: ["Hosting costs", "Maintenance overhead"],
    codeSnippet: {
      title: "The Full Stack Flow",
      language: "javascript",
      description: "From React Button Click to SQL Database.",
      code: `// 1. Frontend (React)
await fetch('/api/comments', { method: 'POST', body: JSON.stringify(data) });

// 2. Backend (Node/Express)
app.post('/api/comments', async (req, res) => {
   const { text } = req.body;
   // 3. Database (SQL)
   await db.query('INSERT INTO comments (text) VALUES (?)', [text]);
   res.json({ success: true });
});`
    }
  },

  // --- MODULE 5: CASE STUDIES ---
  {
    id: GameState.CASE_URL_SHORTENER,
    title: "Design a URL Shortener",
    description: "System design for TinyURL/Bitly.",
    category: 'Case Study',
    topics: ["Base62 Encoding", "KGS (Key Gen Service)", "Redirection"],
    realWorldUses: ["Twitter links", "SMS marketing"],
    pros: ["Saves space", "Tracking analytics"],
    cons: ["Redirect latency", "Dependency on service"],
    codeSnippet: {
      title: "Base62 Encoding",
      language: "javascript",
      description: "Converting ID to Short String.",
      code: `const chars = "0123456789abcdef...ABCDEF";
while (id > 0) {
  shortUrl += chars[id % 62];
  id = Math.floor(id / 62);
}`
    }
  },
  {
    id: GameState.CASE_INSTAGRAM,
    title: "Design Instagram",
    description: "Photo sharing, Feed generation, Fan-out.",
    category: 'Case Study',
    topics: ["Blob Storage", "Fan-out on Write", "CDN", "News Feed"],
    realWorldUses: ["Social Media Feeds", "Activity Streams"],
    pros: ["Fast reads for users", "Scalable feed generation"],
    cons: ["'Fan-out' is write-heavy", "Storage costs"],
    codeSnippet: {
      title: "Fan-out on Write",
      language: "javascript",
      description: "Pushing post ID to followers' timelines.",
      code: `// When user posts:
followers.forEach(followerId => {
  redis.lpush(\`timeline:\${followerId}\`, postId);
});`
    }
  },
  {
    id: GameState.CASE_UBER,
    title: "Design Uber",
    description: "Overview of Ride Sharing Architecture.",
    category: 'Case Study',
    topics: ["Geospatial Indexing", "Real-time matching", "WebSockets"],
    realWorldUses: ["Ride sharing", "Food delivery", "Maps"],
    pros: ["Real-time updates", "Efficient spatial search"],
    cons: ["High consistency requirement", "Complex location sync"],
    quiz: {
      question: "Which data structure is best for searching nearby drivers?",
      options: ["Array", "Linked List", "Quadtree"],
      correctIndex: 2,
      explanation: "Quadtrees partition 2D space recursively, making spatial queries very efficient."
    }
  },
  {
    id: GameState.LEVEL_QUADTREE_DEEP_DIVE,
    title: "Quadtree Deep Dive",
    description: "Interactive visualization of Quadtree partitioning.",
    category: 'Advanced',
    topics: ["Spatial Partitioning", "Collision Detection", "LBS"],
    realWorldUses: ["Game Physics Engines", "GIS Systems", "Image Compression"],
    pros: ["Efficient spatial queries", "Adaptive resolution"],
    cons: ["Expensive to rebuild frequently", "Memory overhead"],
  }
];
