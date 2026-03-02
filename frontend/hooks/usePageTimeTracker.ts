import { useEffect, useRef, useCallback, useState } from 'react';

interface PageTimeData {
    /** Active time in milliseconds (excludes hidden/idle periods) */
    activeTimeMs: number;
    /** Total elapsed time from mount */
    totalTimeMs: number;
    /** Number of tab switches */
    tabSwitches: number;
    /** Whether the user is currently active */
    isActive: boolean;
}

interface UsePageTimeTrackerOptions {
    /** Idle timeout in ms. Default: 5 minutes */
    idleTimeoutMs?: number;
    /** Flush interval in ms. Default: 30 seconds */
    flushIntervalMs?: number;
    /** Callback to flush time data (e.g., send to backend) */
    onFlush?: (data: PageTimeData) => void;
}

/**
 * Track active time on a page. Handles:
 * - Tab visibility changes (visibilitychange API)
 * - Window focus/blur
 * - Idle detection (no interaction for N minutes)
 * - Periodic flush for persistence
 */
export function usePageTimeTracker(options: UsePageTimeTrackerOptions = {}) {
    const {
        idleTimeoutMs = 5 * 60 * 1000, // 5 min
        flushIntervalMs = 30 * 1000,    // 30 sec
        onFlush,
    } = options;

    const mountTimeRef = useRef(Date.now());
    const activeStartRef = useRef(Date.now());
    const accumulatedActiveRef = useRef(0);
    const tabSwitchesRef = useRef(0);
    const isActiveRef = useRef(true);
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const flushCallbackRef = useRef(onFlush);
    flushCallbackRef.current = onFlush;

    const [timeData, setTimeData] = useState<PageTimeData>({
        activeTimeMs: 0, totalTimeMs: 0, tabSwitches: 0, isActive: true,
    });

    const pauseActive = useCallback(() => {
        if (isActiveRef.current) {
            accumulatedActiveRef.current += Date.now() - activeStartRef.current;
            isActiveRef.current = false;
        }
    }, []);

    const resumeActive = useCallback(() => {
        if (!isActiveRef.current) {
            activeStartRef.current = Date.now();
            isActiveRef.current = true;
        }
    }, []);

    const resetIdleTimer = useCallback(() => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (!isActiveRef.current) resumeActive();
        idleTimerRef.current = setTimeout(() => pauseActive(), idleTimeoutMs);
    }, [idleTimeoutMs, pauseActive, resumeActive]);

    const getSnapshot = useCallback((): PageTimeData => {
        const now = Date.now();
        const activeTimeMs = isActiveRef.current
            ? accumulatedActiveRef.current + (now - activeStartRef.current)
            : accumulatedActiveRef.current;
        return {
            activeTimeMs,
            totalTimeMs: now - mountTimeRef.current,
            tabSwitches: tabSwitchesRef.current,
            isActive: isActiveRef.current,
        };
    }, []);

    // Tab visibility + focus/blur handlers
    useEffect(() => {
        const handleVisibility = () => {
            if (document.hidden) {
                pauseActive();
                tabSwitchesRef.current++;
            } else {
                resumeActive();
                resetIdleTimer();
            }
        };

        const handleBlur = () => { pauseActive(); tabSwitchesRef.current++; };
        const handleFocus = () => { resumeActive(); resetIdleTimer(); };

        // Activity events for idle detection
        const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'] as const;
        const handleActivity = () => resetIdleTimer();

        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        activityEvents.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));

        // Start idle timer
        resetIdleTimer();

        // Periodic flush
        const flushInterval = setInterval(() => {
            const data = getSnapshot();
            setTimeData(data);
            flushCallbackRef.current?.(data);
        }, flushIntervalMs);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            activityEvents.forEach(e => window.removeEventListener(e, handleActivity));
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            clearInterval(flushInterval);

            // Final flush on unmount
            const finalData = getSnapshot();
            flushCallbackRef.current?.(finalData);
        };
    }, [pauseActive, resumeActive, resetIdleTimer, getSnapshot, flushIntervalMs]);

    return { timeData, getSnapshot };
}
