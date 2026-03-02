import { useEffect, useRef, useCallback } from 'react';
import { useVisibilityTracker } from './useVisibilityTracker';

interface SectionTimeEntry {
    sectionId: string;
    activeTimeMs: number;
    visibilityPercent: number;
    isVisible: boolean;
}

interface UseSectionTimeTrackerOptions {
    /** Called periodically with per-section time data */
    onFlush?: (sections: SectionTimeEntry[]) => void;
    /** Flush interval in ms. Default: 30 seconds */
    flushIntervalMs?: number;
}

/**
 * Per-section active time tracker.
 * Combines IntersectionObserver visibility with active time accounting.
 * Only counts time for sections that are currently visible AND the user is active.
 *
 * Usage:
 *   const { observeSection, getSectionTimes } = useSectionTimeTracker();
 *   <div ref={el => observeSection('intro', el)}>...</div>
 */
export function useSectionTimeTracker(options: UseSectionTimeTrackerOptions = {}) {
    const { onFlush, flushIntervalMs = 30_000 } = options;

    const sectionTimesRef = useRef<Map<string, { activeMs: number; lastStart: number | null }>>(new Map());
    const flushCallbackRef = useRef(onFlush);
    flushCallbackRef.current = onFlush;

    const handleThresholdCross = useCallback((sectionId: string, _threshold: number, isEntering: boolean) => {
        let entry = sectionTimesRef.current.get(sectionId);
        if (!entry) {
            entry = { activeMs: 0, lastStart: null };
            sectionTimesRef.current.set(sectionId, entry);
        }

        if (isEntering && !entry.lastStart) {
            entry.lastStart = Date.now();
        } else if (!isEntering && entry.lastStart) {
            entry.activeMs += Date.now() - entry.lastStart;
            entry.lastStart = null;
        }
    }, []);

    const { observe, getAllVisibility } = useVisibilityTracker({
        thresholds: [0.5], // Count time when at least 50% visible
        onThresholdCross: handleThresholdCross,
    });

    const getSectionTimes = useCallback((): SectionTimeEntry[] => {
        const now = Date.now();
        const visibility = getAllVisibility();

        return visibility.map(v => {
            const timeEntry = sectionTimesRef.current.get(v.sectionId);
            const activeTimeMs = timeEntry
                ? timeEntry.activeMs + (timeEntry.lastStart ? now - timeEntry.lastStart : 0)
                : 0;

            return {
                sectionId: v.sectionId,
                activeTimeMs,
                visibilityPercent: v.visibilityPercent,
                isVisible: v.isVisible,
            };
        });
    }, [getAllVisibility]);

    // Periodic flush
    useEffect(() => {
        const interval = setInterval(() => {
            const sections = getSectionTimes();
            if (sections.length > 0) {
                flushCallbackRef.current?.(sections);
            }
        }, flushIntervalMs);

        return () => clearInterval(interval);
    }, [getSectionTimes, flushIntervalMs]);

    return { observeSection: observe, getSectionTimes };
}
