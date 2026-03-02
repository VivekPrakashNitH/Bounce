import { useRef, useCallback } from 'react';

interface RetryEntry {
    sectionId?: string;
    quizId?: string;
    attemptNumber: number;
    previousResult?: string;
    timestamps: number[];
}

interface UseRetryTrackerOptions {
    /** Minimum re-engagement time (ms) to count as intentional retry. Default: 3s */
    minEngagementMs?: number;
    /** Callback on each counted retry */
    onRetry?: (entry: RetryEntry) => void;
}

/**
 * Track retry patterns: quiz re-attempts, section re-reads, and level re-opens.
 * Only counts retries that show intent (>3s re-engagement).
 */
export function useRetryTracker(options: UseRetryTrackerOptions = {}) {
    const { minEngagementMs = 3000, onRetry } = options;

    const retriesRef = useRef<Map<string, RetryEntry>>(new Map());
    const engagementStartRef = useRef<Map<string, number>>(new Map());
    const callbackRef = useRef(onRetry);
    callbackRef.current = onRetry;

    /** Signal that the user started re-engaging with a section/quiz */
    const startEngagement = useCallback((id: string) => {
        engagementStartRef.current.set(id, Date.now());
    }, []);

    /** Signal that the user finished re-engaging. Counts as retry if >minEngagementMs */
    const endEngagement = useCallback((id: string, result?: string) => {
        const start = engagementStartRef.current.get(id);
        if (!start) return;

        const duration = Date.now() - start;
        engagementStartRef.current.delete(id);

        if (duration < minEngagementMs) return; // Too short — ignore

        let entry = retriesRef.current.get(id);
        if (!entry) {
            entry = { attemptNumber: 0, timestamps: [] };

            // Determine type from ID pattern
            if (id.startsWith('quiz:')) entry.quizId = id.replace('quiz:', '');
            else entry.sectionId = id;

            retriesRef.current.set(id, entry);
        }

        entry.attemptNumber++;
        entry.previousResult = result;
        entry.timestamps.push(Date.now());

        callbackRef.current?.({ ...entry });
    }, [minEngagementMs]);

    /** Record a quiz retry directly */
    const recordQuizRetry = useCallback((quizId: string, previousResult: string) => {
        const key = `quiz:${quizId}`;
        let entry = retriesRef.current.get(key);
        if (!entry) {
            entry = { quizId, attemptNumber: 0, timestamps: [] };
            retriesRef.current.set(key, entry);
        }
        entry.attemptNumber++;
        entry.previousResult = previousResult;
        entry.timestamps.push(Date.now());
        callbackRef.current?.({ ...entry });
    }, []);

    /** Get all retry data */
    const getRetries = useCallback((): RetryEntry[] => {
        return Array.from(retriesRef.current.values());
    }, []);

    return { startEngagement, endEngagement, recordQuizRetry, getRetries };
}
