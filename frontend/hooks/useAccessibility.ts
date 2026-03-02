import { useEffect, useRef, useCallback } from 'react';

/**
 * Accessibility utility hook — manages focus trapping and keyboard navigation.
 * 
 * Use in modals, drawers, and overlay components to:
 * 1. Trap focus within the container
 * 2. Close on Escape key
 * 3. Restore focus on unmount
 */
export function useFocusTrap(isActive: boolean, onClose?: () => void) {
    const containerRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isActive || !containerRef.current) return;

        // Close on Escape
        if (e.key === 'Escape') {
            onClose?.();
            return;
        }

        // Trap focus on Tab
        if (e.key === 'Tab') {
            const focusable = containerRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }, [isActive, onClose]);

    useEffect(() => {
        if (!isActive) return;

        // Save current focus
        previousFocusRef.current = document.activeElement as HTMLElement;

        // Focus first focusable element
        const timer = setTimeout(() => {
            const first = containerRef.current?.querySelector<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            first?.focus();
        }, 50);

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('keydown', handleKeyDown);
            // Restore focus
            previousFocusRef.current?.focus();
        };
    }, [isActive, handleKeyDown]);

    return containerRef;
}

/**
 * Skip-to-content link for keyboard users.
 * Add this as the first child of <body> or <App>.
 * 
 * Usage: <SkipLink targetId="main-content" />
 * Then add id="main-content" to your main content area.
 */
export function useSkipToContent(targetId: string) {
    const handleClick = useCallback(() => {
        const target = document.getElementById(targetId);
        if (target) {
            target.tabIndex = -1;
            target.focus();
            target.removeAttribute('tabindex');
        }
    }, [targetId]);

    return { handleClick, targetId };
}

/**
 * Announce text to screen readers via aria-live region.
 */
export function useAnnounce() {
    const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
        const el = document.createElement('div');
        el.setAttribute('role', 'status');
        el.setAttribute('aria-live', priority);
        el.setAttribute('aria-atomic', 'true');
        el.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)';
        el.textContent = message;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }, []);

    return announce;
}
