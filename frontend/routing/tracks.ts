import { GameState } from '../types';

export type TrackId = 'system-design' | 'game-dev' | 'cybersecurity' | 'case-studies';

const SYSTEM_DESIGN_LEVELS: GameState[] = [
  GameState.LEVEL_BACKEND_LANGUAGES,
  GameState.LEVEL_CLIENT_SERVER,
  GameState.LEVEL_LOAD_BALANCER,
  GameState.LEVEL_API_GATEWAY,
  GameState.LEVEL_CACHING,
  GameState.LEVEL_DB_SHARDING,
  GameState.LEVEL_CONSISTENT_HASHING,
  GameState.LEVEL_DB_INTERNALS,
  GameState.LEVEL_DB_MIGRATIONS,
  GameState.LEVEL_DOCKER,
  GameState.LEVEL_MESSAGE_QUEUES,
  GameState.LEVEL_DEVOPS_LOOP,
  GameState.LEVEL_HLD_LLD,  // Capstone level - moved to end
];

const GAME_ENGINEERING_LEVELS: GameState[] = [
  GameState.LEVEL_GAME_INTRO,
  GameState.LEVEL_GAME_LOOP,
  GameState.LEVEL_GAME_NETWORKING,
  GameState.LEVEL_GAME_PHYSICS,
  GameState.LEVEL_GAME_ARCH,
  GameState.LEVEL_ORDER_BOOK,
];

const CYBER_LEVELS: GameState[] = [
  GameState.LEVEL_CYBER_ENCRYPTION,
  GameState.LEVEL_CYBER_SQLI,
  GameState.LEVEL_CYBER_AES,
  GameState.LEVEL_CYBER_RSA,
  GameState.LEVEL_CYBER_SHA,
  GameState.LEVEL_CYBER_BCRYPT,
];

// Renamed from LLD_LEVELS - now focuses on real-world case studies
const CASE_STUDY_LEVELS: GameState[] = [
  GameState.CASE_URL_SHORTENER,
  GameState.CASE_INSTAGRAM,
  GameState.CASE_UBER,
  GameState.LEVEL_QUADTREE_DEEP_DIVE,
];

const TRACK_LEVELS: Record<TrackId, GameState[]> = {
  'system-design': SYSTEM_DESIGN_LEVELS,
  'game-dev': GAME_ENGINEERING_LEVELS,
  cybersecurity: CYBER_LEVELS,
  'case-studies': CASE_STUDY_LEVELS,
};

export const TRACK_LABELS: Record<TrackId, string> = {
  'system-design': 'System Design',
  'game-dev': 'Game Engineering',
  cybersecurity: 'Cybersecurity',
  'case-studies': 'Case Studies',
};

export const resolveTrackId = (value?: string | null): TrackId | null => {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (normalized === 'system-design' || normalized === 'system') return 'system-design';
  if (normalized === 'game-dev' || normalized === 'game') return 'game-dev';
  if (normalized === 'cybersecurity' || normalized === 'cyber') return 'cybersecurity';
  if (normalized === 'case-studies' || normalized === 'cases' || normalized === 'lld') return 'case-studies';
  return null;
};

export const getTrackLevels = (trackId: TrackId): GameState[] => TRACK_LEVELS[trackId];

export const getDefaultLevelForTrack = (trackId: TrackId): GameState | null => {
  const levels = getTrackLevels(trackId);
  return levels.length ? levels[0] : null;
};

export const validateLevelForTrack = (trackId: TrackId, levelId?: string | null): GameState | null => {
  if (!levelId) return null;
  const levels = getTrackLevels(trackId);
  return levels.includes(levelId as GameState) ? (levelId as GameState) : null;
};

export const isSystemDesignTrack = (trackId: TrackId) => trackId === 'system-design';
export const isSystemDesignCapstone = (levelId: GameState) => levelId === GameState.LEVEL_HLD_LLD;

export const ALL_TRACK_IDS: TrackId[] = ['system-design', 'game-dev', 'cybersecurity', 'case-studies'];
