
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
}

export interface CodeSnippet {
  language: string;
  title: string;
  code: string;
  description: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseLevel {
  id: GameState;
  title: string;
  description: string;
  category: 'Fundamentals' | 'Data' | 'Communication' | 'Advanced' | 'Case Study' | 'LLD & Patterns' | 'Languages' | 'Gaming' | 'DevOps' | 'Full Stack' | 'Cybersecurity';
  topics: string[];
  codeSnippet?: CodeSnippet;
  // New Educational Content
  realWorldUses: string[];
  pros: string[];
  cons: string[];
  quiz?: QuizQuestion;
}

export enum GameState {
  PLAYGROUND = 'PLAYGROUND',

  // Module 0: Languages & Concepts
  LEVEL_BACKEND_LANGUAGES = 'LEVEL_BACKEND_LANGUAGES',
  LEVEL_HLD_LLD = 'LEVEL_HLD_LLD',

  // Module 1: Fundamentals
  LEVEL_CLIENT_SERVER = 'LEVEL_CLIENT_SERVER',
  LEVEL_LOAD_BALANCER = 'LEVEL_LOAD_BALANCER',
  LEVEL_API_GATEWAY = 'LEVEL_API_GATEWAY',

  // Module 2: Data & Caching
  LEVEL_CACHING = 'LEVEL_CACHING',
  LEVEL_DB_SHARDING = 'LEVEL_DB_SHARDING',
  LEVEL_DB_INTERNALS = 'LEVEL_DB_INTERNALS',
  LEVEL_CONSISTENT_HASHING = 'LEVEL_CONSISTENT_HASHING',
  LEVEL_DB_MIGRATIONS = 'LEVEL_DB_MIGRATIONS',

  // Module 3: Communication & Infrastructure
  LEVEL_DOCKER = 'LEVEL_DOCKER',
  LEVEL_MESSAGE_QUEUES = 'LEVEL_MESSAGE_QUEUES',
  LEVEL_DEVOPS_LOOP = 'LEVEL_DEVOPS_LOOP',

  // Module 4: LLD & Patterns 
  LEVEL_LLD_FACTORY = 'LEVEL_LLD_FACTORY',
  LEVEL_LLD_OBSERVER = 'LEVEL_LLD_OBSERVER',

  // Module 5: Case Studies & Advanced
  CASE_URL_SHORTENER = 'CASE_URL_SHORTENER',
  CASE_INSTAGRAM = 'CASE_INSTAGRAM',
  CASE_UBER = 'CASE_UBER',
  LEVEL_QUADTREE_DEEP_DIVE = 'LEVEL_QUADTREE_DEEP_DIVE',
  LEVEL_FULL_STACK_HOWTO = 'LEVEL_FULL_STACK_HOWTO',

  // Module 6: Game Engineering
  LEVEL_GAME_INTRO = 'LEVEL_GAME_INTRO',
  LEVEL_GAME_LOOP = 'LEVEL_GAME_LOOP',
  LEVEL_GAME_NETWORKING = 'LEVEL_GAME_NETWORKING',
  LEVEL_GAME_PHYSICS = 'LEVEL_GAME_PHYSICS',
  LEVEL_GAME_ARCH = 'LEVEL_GAME_ARCH',
  LEVEL_ORDER_BOOK = 'LEVEL_ORDER_BOOK',

  // Module 7: Cybersecurity (New)
  LEVEL_CYBER_ENCRYPTION = 'LEVEL_CYBER_ENCRYPTION',
  LEVEL_CYBER_SQLI = 'LEVEL_CYBER_SQLI',
  LEVEL_CYBER_AES = 'LEVEL_CYBER_AES',
  LEVEL_CYBER_RSA = 'LEVEL_CYBER_RSA',
  LEVEL_CYBER_SHA = 'LEVEL_CYBER_SHA',
  LEVEL_CYBER_BCRYPT = 'LEVEL_CYBER_BCRYPT',
}
