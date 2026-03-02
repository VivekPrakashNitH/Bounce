import { useEffect, useRef, useCallback, useState } from 'react';

type TabState = 'active' | 'inactive' | 'idle';

interface UseTabStateOptions {
    /** Idle timeout in ms. Default: 5 minutes */
    idleTimeoutMs?: number;
    /** Callback on state change */
    onStateChange?: (state: TabState, prev: TabState) => void;
}

/**
 * Central source of truth for tab visibility/focus/idle.
 * All other trackers should depend on this instead of implementing their own detection.
 */
export function useTabState(options: UseTabStateOptions = {}) {
    const { idleTimeoutMs = 5 * 60 * 1000, onStateChange } = options;

    const [state, setState] = useState<TabState>('active');
    const stateRef = useRef<TabState>('active');
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const callbackRef = useRef(onStateChange);
    callbackRef.current = onStateChange;

    const transition = useCallback((newState: TabState) => {
        const prev = stateRef.current;
        if (prev === newState) return;
        stateRef.current = newState;
        setState(newState);
        callbackRef.current?.(newState, prev);
    }, []);

    const resetIdleTimer = useCallback(() => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        transition('active');
        idleTimerRef.current = setTimeout(() => transition('idle'), idleTimeoutMs);
    }, [idleTimeoutMs, transition]);

    useEffect(() => {
        const handleVisibility = () => {
            document.hidden ? transition('inactive') : resetIdleTimer();
        };
        const handleBlur = () => transition('inactive');
        const handleFocus = () => resetIdleTimer();
        const handleActivity = () => {
            if (stateRef.current === 'idle') resetIdleTimer();
        };

        document.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        ['mousedown', 'keydown', 'touchstart'].forEach(e =>
            window.addEventListener(e, handleActivity, { passive: true })
        );

        resetIdleTimer();

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            ['mousedown', 'keydown', 'touchstart'].forEach(e =>
                window.removeEventListener(e, handleActivity)
            );
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        };
    }, [transition, resetIdleTimer]);

    return { state, isActive: state === 'active' };
}
