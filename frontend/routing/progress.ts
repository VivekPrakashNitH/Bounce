import { GameState } from '../types';
import { TrackId, getDefaultLevelForTrack, getTrackLevels } from './tracks';

const PROGRESS_KEY = 'bounce_progress_v2';
const COMPLETED_KEY = 'bounce_completed_levels';

export interface StoredProgress {
  track: TrackId;
  levelId: GameState;
  sectionIndex?: number;
  totalSections?: number;
}

const isValidStoredProgress = (value: any): value is StoredProgress => {
  return Boolean(value && value.track && value.levelId);
};

export const loadStoredProgress = (): StoredProgress | null => {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidStoredProgress(parsed)) return null;
    const levels = getTrackLevels(parsed.track);
    if (!levels.includes(parsed.levelId)) return null;
    return parsed;
  } catch (err) {
    return null;
  }
};

export const loadTrackProgress = (track: TrackId): GameState | null => {
  const stored = loadStoredProgress();
  if (stored?.track === track) {
    const levels = getTrackLevels(track);
    return levels.includes(stored.levelId) ? stored.levelId : levels[0] ?? null;
  }
  return getDefaultLevelForTrack(track);
};

export const persistProgress = (track: TrackId, levelId: GameState, sectionIndex?: number, totalSections?: number) => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({ track, levelId, sectionIndex, totalSections } satisfies StoredProgress));
};

export const readCompletedLevels = (): GameState[] => {
  const raw = localStorage.getItem(COMPLETED_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
};

export const markLevelComplete = (levelId: GameState): GameState[] => {
  const completed = readCompletedLevels();
  if (!completed.includes(levelId)) {
    completed.push(levelId);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
  }
  return completed;
};

export const resetTrackProgress = (track: TrackId): GameState | null => {
  const first = getDefaultLevelForTrack(track);
  if (first) {
    persistProgress(track, first);
  }
  return first;
};

export const resetTrackCompletedLevels = (track: TrackId): GameState[] => {
  const completed = readCompletedLevels();
  const trackLevels = getTrackLevels(track);
  // Filter out levels from this track
  const remaining = completed.filter(level => !trackLevels.includes(level));
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(remaining));
  return remaining;
};

export const fullResetTrack = (track: TrackId): void => {
  resetTrackProgress(track);
  resetTrackCompletedLevels(track);
};
