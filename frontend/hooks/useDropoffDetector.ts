import { useEffect, useRef, useCallback } from 'react';

interface DropoffEvent {
    pageId: string;
    lastSectionSeen: string | null;
    scrollDepthPercent: number;
    timeSpentMs: number;
    referrer: string;
}

interface UseDropoffDetectorOptions {
    /** Page identifier */
    pageId: string;
    /** Minimum time before counting as a real visit (ms). Default: 10s */
    minTimeMs?: number;
    /** Minimum scroll depth before counting as engaged (%). Default: 25 */
    minScrollPercent?: number;
    /** Called when a drop-off is detected */
    onDropoff?: (event: DropoffEvent) => void;
}

/**
 * Detect when users leave a page without completing it.
 * A drop-off = leaving with <10s spent or <25% scrolled.
 */
export function useDropoffDetector(options: UseDropoffDetectorOptions) {
    const {
        pageId,
        minTimeMs = 10_000,
        minScrollPercent = 25,
        onDropoff,
    } = options;

    const mountTimeRef = useRef(Date.now());
    const maxScrollRef = useRef(0);
    const lastSectionRef = useRef<string | null>(null);
    const completedRef = useRef(false);
    const callbackRef = useRef(onDropoff);
    callbackRef.current = onDropoff;

    // Track scroll
    useEffect(() => {
        const handleScroll = () => {
            const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            const viewportHeight = window.innerHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            if (docHeight > viewportHeight) {
                const percent = Math.round((scrollTop / (docHeight - viewportHeight)) * 100);
                maxScrollRef.current = Math.max(maxScrollRef.current, percent);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /** Mark the current page as completed (prevents drop-off event) */
    const markCompleted = useCallback(() => {
        completedRef.current = true;
    }, []);

    /** Update which section was last visible */
    const setLastSection = useCallback((sectionId: string) => {
        lastSectionRef.current = sectionId;
    }, []);

    // Fire drop-off on unmount
    useEffect(() => {
        return () => {
            if (completedRef.current) return; // Completed = not a drop-off

            const timeSpentMs = Date.now() - mountTimeRef.current;
            const scrollDepthPercent = maxScrollRef.current;

            // Only fire if visit was too short or too shallow
            if (timeSpentMs < minTimeMs || scrollDepthPercent < minScrollPercent) {
                callbackRef.current?.({
                    pageId,
                    lastSectionSeen: lastSectionRef.current,
                    scrollDepthPercent,
                    timeSpentMs,
                    referrer: document.referrer,
                });
            }
        };
    }, [pageId, minTimeMs, minScrollPercent]);

    return { markCompleted, setLastSection };
}
