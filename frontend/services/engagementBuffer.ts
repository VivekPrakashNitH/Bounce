/**
 * Client-side engagement event buffer.
 * Queues events and flushes in batches to reduce HTTP overhead.
 *
 * Flush triggers:
 * 1. Buffer reaches maxSize (default 20)
 * 2. Timer expires (default 30s)
 * 3. Page unload (via navigator.sendBeacon)
 */

export interface EngagementEvent {
    eventType: string;
    pageId: string;
    sectionId?: string;
    timestamp: number;
    duration?: number;
    scrollDepth?: number;
    metadata?: Record<string, unknown>;
}

type FlushFn = (events: EngagementEvent[]) => void | Promise<void>;

interface EngagementBufferOptions {
    /** Max events before auto-flush. Default: 20 */
    maxSize?: number;
    /** Flush interval in ms. Default: 30s */
    flushIntervalMs?: number;
    /** API endpoint for sendBeacon. Default: /api/v1/engagement/batch */
    beaconEndpoint?: string;
}

class EngagementEventBuffer {
    private buffer: EngagementEvent[] = [];
    private flushFn: FlushFn;
    private maxSize: number;
    private flushIntervalMs: number;
    private beaconEndpoint: string;
    private timer: ReturnType<typeof setInterval> | null = null;
    private retryQueue: EngagementEvent[] = [];
    private retryCount = 0;
    private readonly MAX_RETRIES = 3;

    constructor(flushFn: FlushFn, options: EngagementBufferOptions = {}) {
        this.flushFn = flushFn;
        this.maxSize = options.maxSize ?? 20;
        this.flushIntervalMs = options.flushIntervalMs ?? 30_000;
        this.beaconEndpoint = options.beaconEndpoint ?? '/api/v1/engagement/batch';

        // Auto-flush on interval
        this.timer = setInterval(() => this.flush(), this.flushIntervalMs);

        // Flush on page unload
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', this.handleUnload);
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
        }
    }

    /** Add an event to the buffer */
    push(event: EngagementEvent): void {
        this.buffer.push({
            ...event,
            timestamp: event.timestamp || Date.now(),
        });

        if (this.buffer.length >= this.maxSize) {
            this.flush();
        }
    }

    /** Push a typed event with less boilerplate */
    track(eventType: string, pageId: string, data?: Partial<EngagementEvent>): void {
        this.push({
            eventType,
            pageId,
            timestamp: Date.now(),
            ...data,
        });
    }

    /** Flush all buffered events */
    async flush(): Promise<void> {
        if (this.buffer.length === 0 && this.retryQueue.length === 0) return;

        const events = [...this.retryQueue, ...this.buffer];
        this.buffer = [];
        this.retryQueue = [];

        try {
            await this.flushFn(events);
            this.retryCount = 0;
        } catch {
            // Retry with backoff
            if (this.retryCount < this.MAX_RETRIES) {
                this.retryQueue = events;
                this.retryCount++;
            }
            // After MAX_RETRIES, events are dropped (acceptable trade-off)
        }
    }

    /** Get current buffer size */
    get size(): number {
        return this.buffer.length;
    }

    /** Cleanup — stop timers and remove listeners */
    destroy(): void {
        if (this.timer) clearInterval(this.timer);
        if (typeof window !== 'undefined') {
            window.removeEventListener('beforeunload', this.handleUnload);
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        }
        this.flush(); // Final flush
    }

    private handleUnload = (): void => {
        // sendBeacon is fire-and-forget, works even during page unload
        if (this.buffer.length === 0) return;
        const payload = JSON.stringify({ events: this.buffer });
        try {
            navigator.sendBeacon(this.beaconEndpoint, payload);
        } catch {
            // sendBeacon failed — events lost (acceptable)
        }
        this.buffer = [];
    };

    private handleVisibilityChange = (): void => {
        if (document.hidden) {
            // Flush when user switches tabs (data safety)
            this.flush();
        }
    };
}

// Singleton instance
let _instance: EngagementEventBuffer | null = null;

export function getEngagementBuffer(
    flushFn?: FlushFn,
    options?: EngagementBufferOptions
): EngagementEventBuffer {
    if (!_instance && flushFn) {
        _instance = new EngagementEventBuffer(flushFn, options);
    }
    return _instance!;
}

export function destroyEngagementBuffer(): void {
    _instance?.destroy();
    _instance = null;
}

export { EngagementEventBuffer };
