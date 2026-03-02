import { progressApi } from './api';
import { readCompletedLevels } from '../routing/progress';

/**
 * Sync localStorage progress to server.
 * Called on app load — merges local progress with server state.
 * localStorage remains the offline fallback.
 */
export async function syncProgressToServer(): Promise<void> {
    const token = localStorage.getItem('bounce_token');
    if (!token) return; // Not logged in — skip sync

    try {
        const completedLevels = readCompletedLevels();
        if (completedLevels.length === 0) return;

        const levels = completedLevels.map(levelId => ({
            levelId: String(levelId),
            completed: true,
            score: 0, // Score tracked separately via quiz results
        }));

        await progressApi.sync(levels);
    } catch (error) {
        // Silently fail — localStorage is the fallback
        console.debug('[ProgressSync] Server sync failed, using localStorage', error);
    }
}

/**
 * Pull server progress into localStorage (on login).
 * Merges: server wins for completed status, local wins for current position.
 */
export async function pullServerProgress(): Promise<void> {
    const token = localStorage.getItem('bounce_token');
    if (!token) return;

    try {
        const { levels } = await progressApi.get();
        const currentCompleted = readCompletedLevels();

        // Merge server levels into local completed list
        for (const level of levels) {
            if (level.completed && !currentCompleted.includes(level.level_id as any)) {
                currentCompleted.push(level.level_id as any);
            }
        }

        localStorage.setItem('bounce_completed_levels', JSON.stringify(currentCompleted));
    } catch (error) {
        console.debug('[ProgressSync] Server pull failed', error);
    }
}
