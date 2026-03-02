import { useEffect, useRef, useState, useCallback } from 'react';

interface VisibilityEntry {
    sectionId: string;
    isVisible: boolean;
    visibilityPercent: number;
    enteredAt: number | null;
    totalVisibleMs: number;
}

interface UseVisibilityTrackerOptions {
    /** Visibility thresholds to observe (0-1). Default: [0.25, 0.5, 0.75, 1.0] */
    thresholds?: number[];
    /** Root margin for IntersectionObserver */
    rootMargin?: string;
    /** Callback when a threshold is crossed */
    onThresholdCross?: (sectionId: string, threshold: number, isEntering: boolean) => void;
}

/**
 * Track when content sections enter/leave the viewport.
 * Uses IntersectionObserver for efficient, scroll-event-free tracking.
 *
 * Usage:
 *   const { observe, getVisibility } = useVisibilityTracker({ onThresholdCross });
 *   <div ref={el => observe('intro', el)}>...</div>
 */
export function useVisibilityTracker(options: UseVisibilityTrackerOptions = {}) {
    const {
        thresholds = [0.25, 0.5, 0.75, 1.0],
        rootMargin = '0px',
        onThresholdCross,
    } = options;

    const entriesRef = useRef<Map<string, VisibilityEntry>>(new Map());
    const observerRef = useRef<IntersectionObserver | null>(null);
    const elementMapRef = useRef<Map<string, Element>>(new Map());
    const callbackRef = useRef(onThresholdCross);
    callbackRef.current = onThresholdCross;

    // Create observer once
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (ioEntries) => {
                const now = Date.now();
                for (const ioEntry of ioEntries) {
                    const sectionId = (ioEntry.target as HTMLElement).dataset.trackSection;
                    if (!sectionId) continue;

                    let entry = entriesRef.current.get(sectionId);
                    if (!entry) {
                        entry = {
                            sectionId,
                            isVisible: false,
                            visibilityPercent: 0,
                            enteredAt: null,
                            totalVisibleMs: 0,
                        };
                        entriesRef.current.set(sectionId, entry);
                    }

                    const prevPercent = entry.visibilityPercent;
                    entry.visibilityPercent = Math.round(ioEntry.intersectionRatio * 100);
                    entry.isVisible = ioEntry.isIntersecting;

                    if (ioEntry.isIntersecting && !entry.enteredAt) {
                        entry.enteredAt = now;
                    } else if (!ioEntry.isIntersecting && entry.enteredAt) {
                        entry.totalVisibleMs += now - entry.enteredAt;
                        entry.enteredAt = null;
                    }

                    // Fire threshold callbacks
                    if (callbackRef.current) {
                        for (const t of thresholds) {
                            const threshold = t * 100;
                            if (prevPercent < threshold && entry.visibilityPercent >= threshold) {
                                callbackRef.current(sectionId, t, true);
                            } else if (prevPercent >= threshold && entry.visibilityPercent < threshold) {
                                callbackRef.current(sectionId, t, false);
                            }
                        }
                    }
                }
            },
            { threshold: thresholds, rootMargin }
        );

        return () => {
            observerRef.current?.disconnect();
        };
    }, [thresholds.join(','), rootMargin]);

    /** Observe a section element */
    const observe = useCallback((sectionId: string, element: HTMLElement | null) => {
        const observer = observerRef.current;
        if (!observer) return;

        // Unobserve old element for this section
        const oldEl = elementMapRef.current.get(sectionId);
        if (oldEl) observer.unobserve(oldEl);

        if (element) {
            element.dataset.trackSection = sectionId;
            observer.observe(element);
            elementMapRef.current.set(sectionId, element);
        } else {
            elementMapRef.current.delete(sectionId);
        }
    }, []);

    /** Get current visibility data for a section */
    const getVisibility = useCallback((sectionId: string): VisibilityEntry | undefined => {
        return entriesRef.current.get(sectionId);
    }, []);

    /** Get all visibility data */
    const getAllVisibility = useCallback((): VisibilityEntry[] => {
        const now = Date.now();
        return Array.from(entriesRef.current.values()).map(e => ({
            ...e,
            totalVisibleMs: e.enteredAt ? e.totalVisibleMs + (now - e.enteredAt) : e.totalVisibleMs,
        }));
    }, []);

    return { observe, getVisibility, getAllVisibility };
}
