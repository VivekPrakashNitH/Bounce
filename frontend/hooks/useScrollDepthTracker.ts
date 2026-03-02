import { useEffect, useRef, useCallback } from 'react';

interface UseScrollDepthTrackerOptions {
    /** Milestones to track (0-100). Default: [25, 50, 75, 90, 100] */
    milestones?: number[];
    /** Callback when a milestone is reached */
    onMilestone?: (milestone: number) => void;
}

/**
 * Track scroll depth milestones. Each milestone fires once per page load.
 * Uses requestAnimationFrame for efficient scroll calculations.
 */
export function useScrollDepthTracker(options: UseScrollDepthTrackerOptions = {}) {
    const {
        milestones = [25, 50, 75, 90, 100],
        onMilestone,
    } = options;

    const reachedRef = useRef<Set<number>>(new Set());
    const rafRef = useRef<number | null>(null);
    const callbackRef = useRef(onMilestone);
    callbackRef.current = onMilestone;

    const getScrollPercent = useCallback((): number => {
        const docHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        const viewportHeight = window.innerHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (docHeight <= viewportHeight) return 100;
        return Math.round((scrollTop / (docHeight - viewportHeight)) * 100);
    }, []);

    const checkMilestones = useCallback(() => {
        const percent = getScrollPercent();

        for (const milestone of milestones) {
            if (percent >= milestone && !reachedRef.current.has(milestone)) {
                reachedRef.current.add(milestone);
                callbackRef.current?.(milestone);
            }
        }
    }, [getScrollPercent, milestones]);

    useEffect(() => {
        const handleScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(checkMilestones);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check (content might start partially scrolled)
        checkMilestones();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [checkMilestones]);

    /** Reset milestones (for SPA navigation within the same mount) */
    const reset = useCallback(() => {
        reachedRef.current.clear();
    }, []);

    /** Get all milestones reached so far */
    const getReached = useCallback((): number[] => {
        return Array.from(reachedRef.current).sort((a, b) => a - b);
    }, []);

    return { reset, getReached, currentPercent: getScrollPercent };
}
