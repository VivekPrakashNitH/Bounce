/**
 * Web Vitals performance monitoring.
 * Captures Core Web Vitals and sends to engagement API.
 */

interface WebVital {
    name: 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'INP';
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
}

type VitalCallback = (vital: WebVital) => void;

const thresholds: Record<string, [number, number]> = {
    LCP: [2500, 4000],   // good < 2.5s, poor > 4s
    FID: [100, 300],     // good < 100ms, poor > 300ms
    CLS: [0.1, 0.25],   // good < 0.1, poor > 0.25
    TTFB: [800, 1800],    // good < 800ms, poor > 1.8s
    INP: [200, 500],     // good < 200ms, poor > 500ms
};

function rate(name: string, value: number): WebVital['rating'] {
    const [good, poor] = thresholds[name] || [Infinity, Infinity];
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
}

/**
 * Observe Largest Contentful Paint.
 */
function observeLCP(cb: VitalCallback): void {
    if (!('PerformanceObserver' in window)) return;
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        if (last) {
            cb({ name: 'LCP', value: last.startTime, rating: rate('LCP', last.startTime) });
        }
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
}

/**
 * Observe First Input Delay.
 */
function observeFID(cb: VitalCallback): void {
    if (!('PerformanceObserver' in window)) return;
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as Array<PerformanceEntry & { processingStart: number; startTime: number }>;
        for (const entry of entries) {
            const delay = entry.processingStart - entry.startTime;
            cb({ name: 'FID', value: delay, rating: rate('FID', delay) });
        }
    });
    observer.observe({ type: 'first-input', buffered: true });
}

/**
 * Observe Cumulative Layout Shift.
 */
function observeCLS(cb: VitalCallback): void {
    if (!('PerformanceObserver' in window)) return;
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<PerformanceEntry & { hadRecentInput: boolean; value: number }>) {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
            }
        }
    });
    observer.observe({ type: 'layout-shift', buffered: true });

    // Report final CLS on page hide
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cb({ name: 'CLS', value: clsValue, rating: rate('CLS', clsValue) });
        }
    }, { once: true });
}

/**
 * Measure Time to First Byte.
 */
function measureTTFB(cb: VitalCallback): void {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (nav) {
        const ttfb = nav.responseStart - nav.requestStart;
        cb({ name: 'TTFB', value: ttfb, rating: rate('TTFB', ttfb) });
    }
}

/**
 * Initialize all Web Vitals observers.
 * Callback fires once per metric per page load.
 */
export function initWebVitals(cb: VitalCallback): void {
    if (typeof window === 'undefined') return;

    // Defer to avoid blocking main thread
    requestAnimationFrame(() => {
        observeLCP(cb);
        observeFID(cb);
        observeCLS(cb);
        measureTTFB(cb);
    });
}

export type { WebVital, VitalCallback };
